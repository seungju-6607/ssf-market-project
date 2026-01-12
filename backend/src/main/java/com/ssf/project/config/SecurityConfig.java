package com.ssf.project.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.*;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        System.out.println("### SSF SecurityConfig LOADED ###");

        http
                // ✅ 지금은 쿠키/세션 기반 유지가 목적 → CSRF는 일단 off (API/발표용)
                .csrf(csrf -> csrf.disable())

                // ✅ CORS (가장 중요)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ 세션 사용 (카카오 로그인 후 JSESSIONID로 유지하려면 필요)
                // IF_REQUIRED: 필요할 때 세션 생성
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // ✅ 컨트롤러에서 SecurityContextHolder에 넣은 인증정보를 "명시 저장" 하려면 true
                // (너가 지금 세션 유지 이슈라면 그대로 두는 게 안전)
                .securityContext(sc -> sc.requireExplicitSave(true))

                // ✅ 폼/베이직 인증 안씀
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())

                // ✅ 불필요하면 꺼도 됨
                .requestCache(rc -> rc.disable())

                // ✅ 발표/개발용: 전부 허용 (나중에 restrict 가능)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().permitAll()
                )

                // ✅ Provider 등록
                .authenticationProvider(authenticationProvider());

        return http.build();
    }

    /**
     * ✅ SecurityContext를 세션에 저장하는 레포지토리
     * 컨트롤러에서 SecurityContextHolder 세팅 + 명시 저장을 한다면 이게 필요함.
     */
    @Bean
    public HttpSessionSecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * ✅ 핵심: Vercel(프론트) ↔ Render(백엔드) 크로스 도메인에서
     * 세션 쿠키(JSESSIONID)가 저장/전달되도록 CORS를 정확히 맞춘다.
     *
     * 포인트:
     * - allowCredentials=true 인 상태에서 allowedOrigin에 "*" 절대 안됨
     * - allowedOriginPatterns 로 vercel wildcard 허용
     * - 로컬도 같이 허용
     * - 쿠키 전달되려면 프론트 axios/fetch도 withCredentials/credentials include 필요
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3030",
                "https://ssf-market-project.vercel.app",
                "https://*.vercel.app"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        // 프론트에서 응답 헤더 읽을 때 필요하면 유지
        configuration.setExposedHeaders(List.of("Location", "Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

/**
 * (현재 CSRF disable이라 실질적으로 사용되진 않지만,
 * 기존 코드 구조 유지용으로 남겨둠)
 */
final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {
    private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
    private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        this.xor.handle(request, response, csrfToken);
        csrfToken.get();
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        String headerValue = request.getHeader(csrfToken.getHeaderName());
        return (StringUtils.hasText(headerValue) ? this.plain : this.xor)
                .resolveCsrfTokenValue(request, csrfToken);
    }
}
