package com.ssf.project;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ✅ 발표용: CSRF 끔
                .csrf(csrf -> csrf.disable())

                // ✅ CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ 발표용: 로그인/세션/리다이렉트 관련 기능 다 끔
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .requestCache(rc -> rc.disable())

                // ✅ 발표용: 세션 정책은 크게 상관없지만, 깔끔하게 IF_REQUIRED로
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // ✅ 발표용: 모든 요청 허용 (403 방지)
                .authorizeHttpRequests(auth -> auth
                        // 프리플라이트는 무조건 허용
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /** ✅ CORS 설정 (로컬 3000/3030 + Vercel 전체 허용) */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // allowCredentials(true) 사용 시 allowedOrigins에 "*" 불가 → patterns 사용
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3030",
                "https://*.vercel.app"
                // 커스텀 도메인 있으면 추가:
                // , "https://your-domain.com"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
