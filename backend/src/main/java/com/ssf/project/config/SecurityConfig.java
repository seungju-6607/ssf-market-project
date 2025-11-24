package com.ssf.project.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
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

import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity // Spring Security 활성화, dependencies  추가
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authenticationProvider(authenticationProvider())
                .csrf((csrf) -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
                )
                .cors((cors) -> cors
                        .configurationSource(corsConfigurationSource())
                )
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) //요청이 있을때만 세션을 만든다.
                )
                .securityContext(sc -> sc.requireExplicitSave(true)) // ← 선택. true면 아래 로그인 컨트롤러에서 save 필요
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .requestCache(rc -> rc.disable()) //로그인 후 리다이렉트 방지
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/csrf/**", "/member/signup", "/member/apiSignup", "/member/login", "/member/logout", "/member/idcheck",
//                                "/market/add", "/market/list", "/market/upload",
                                "/market/**", "/uploads/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }//SecurityFilterChain Bean

    /**
     * 사용자의 인증 상태를 Http 세션에 저장하고 로드하는 역할을 담당하는 핵심 컴포넌트
     */
    @Bean
    public HttpSessionSecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }


    /**
     * 로그인 사용자 정보를 저장한 UserDetailService객체를 Dao객체(DB연동객체)의 파라미터로
     * 전송하고 AuthenticationProvider를 통해 로그인 실행
     */
    /** ✅ DaoAuthenticationProvider 하나만 등록 */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    /** AuthenticationManager: DaoAuthenticationProvider + BCrypt */
    // ✅ 권장: AuthenticationManager는 AuthenticationConfiguration에서 가져오기
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    //CORS 보안정책 수행 객체
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST"));
        configuration.setAllowCredentials(true);  // 🔥 프론트에서 JSESSIONID/CSRF 쿠키 받으려면 필수
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    // 비밀번호 암호화 설정 (PasswordEncoder)
    // Spring Security는 반드시 비밀번호를 암호화하여 저장하고 비교해야 함!!
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}//SecurityConfig class

/**
 * ✨✨중요::
 * SPA(Single Page Application) : React, VUE 로 개발되는 사이트에서 CSRF 토큰 요청시
 * 필터링에서 호출하여 실행되는 CSRF 핸들러 객체
 */
final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {
    private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
    private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        /*
         * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
         * the CsrfToken when it is rendered in the response body.
         */
        this.xor.handle(request, response, csrfToken);
        /*
         * Render the token value to a cookie by causing the deferred token to be loaded.
         */
        csrfToken.get();
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        String headerValue = request.getHeader(csrfToken.getHeaderName());
        /*
         * If the request contains a request header, use CsrfTokenRequestAttributeHandler
         * to resolve the CsrfToken. This applies when a single-page application includes
         * the header value automatically, which was obtained via a cookie containing the
         * raw CsrfToken.
         *
         * In all other cases (e.g. if the request contains a request parameter), use
         * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
         * when a server-side rendered form includes the _csrf request parameter as a
         * hidden input.
         */
        return (StringUtils.hasText(headerValue) ? this.plain : this.xor).resolveCsrfTokenValue(request, csrfToken);
    }
}

