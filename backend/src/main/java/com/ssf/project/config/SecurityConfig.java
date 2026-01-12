package com.ssf.project.config;

import com.ssf.project.security.JwtAuthenticationFilter;
import com.ssf.project.security.JwtTokenProvider;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService, JwtTokenProvider jwtTokenProvider) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        System.out.println("### SSF SecurityConfig (JWT) LOADED ###");

        http
                // ✅ JWT는 쿠키/세션 안 쓰는 게 기본 → CSRF 끔
                .csrf(csrf -> csrf.disable())

                // ✅ CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ 세션 완전 비활성화 (중요)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ✅ 폼/베이직 인증 안씀
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .requestCache(rc -> rc.disable())

                // ✅ 발표/개발용: 일단 전부 허용(기존 유지)
                //    인증이 필요하면 아래에서 anyRequest().authenticated() 로 바꾸면 됨.
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/member/login", "/member/logout", "/member/signup", "/member/apiSignup",
                                "/member/idcheck", "/member/findId", "/member/findPwd").permitAll()
                        .anyRequest().permitAll()
                )

                // ✅ Provider 등록 (email/password 로그인용)
                .authenticationProvider(authenticationProvider())

                // ✅ JWT 필터 장착: Authorization 헤더의 Bearer 토큰을 인증으로 바꿔줌
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService);
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

        // ✅ JWT는 쿠키 안 쓰니까 allowCredentials는 필수 아님
        //    (true로 둬도 큰 문제는 없지만, 불필요하면 false가 깔끔)
        configuration.setAllowCredentials(false);

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
