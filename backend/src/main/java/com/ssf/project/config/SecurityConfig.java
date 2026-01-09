package com.ssf.project.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
        http
                // ✅ 발표/배포용: 일단 CSRF 끔 (지금 너 코드 유지)
                .csrf(csrf -> csrf.disable())

                .authenticationProvider(authenticationProvider())

                // ✅ CORS 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .securityContext(sc -> sc.requireExplicitSave(true))

                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .requestCache(rc -> rc.disable())

                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/csrf/**",
                                "/member/signup",
                                "/member/apiSignup",
                                "/member/login",
                                "/member/logout",
                                "/member/idcheck",
                                "/member/findId",
                                "/member/findPwd",
                                "/member/updatePwd",
                                "/member/findAll",
                                "/member/deleteByEmail",
                                "/market/**",
                                "/uploads/**",
                                "/wishlist/**",
                                "/api/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

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
     * ✅ Vercel(프론트) + 외부 백엔드 연동용 CORS 설정
     *
     * - allowCredentials(true) 때문에 allowedOrigins에 "*" 사용 불가
     * - 그래서 allowedOriginPatterns로 vercel.app 패턴을 허용
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ 로컬 + Vercel(Preview/Production) 허용
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "https://*.vercel.app"
                // 커스텀 도메인 쓰면 여기에 추가:
                // , "https://your-domain.com"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true); // 쿠키(JSESSIONID 등) 사용 시 필요
        configuration.setAllowedHeaders(List.of("*"));

        // (선택) 프론트에서 특정 응답 헤더를 읽어야 하면 추가
        // configuration.setExposedHeaders(List.of("Set-Cookie"));

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
 * ✨✨중요::
 * SPA(Single Page Application) : React, VUE 로 개발되는 사이트에서 CSRF 토큰 요청시
 * 필터링에서 호출하여 실행되는 CSRF 핸들러 객체
 *
 * (현재 SecurityFilterChain에서 csrf.disable()이라 실제로는 사용되지 않을 수 있음.
 *  그래도 너가 원래 두었던 코드 그대로 유지)
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
