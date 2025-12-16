package com.springboot.next_shoppy_springboot.config;

import com.springboot.next_shoppy_springboot.service.JwtUtilService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.*;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtUtilService jwtUtilService;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ✅ CSRF 유지 (쿠키 인증이므로 원칙적으로 ON), 선택적 사용 가능!
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ DaoAuthenticationProvider 유지 (로그인 시 ID/PW 검증용)
                .authenticationProvider(authenticationProvider()) //AuthenticationManager인증 수행시 호출

                // ✅ 세션 사용 안 함
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .requestCache(rc -> rc.disable()) //로그인 후 리다이렉트 방지

                // ✅ JWT 쿠키 인증 필터 추가
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)

                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/error")
                            .permitAll()
                        .requestMatchers( "/member/**", "/product/**", "/auth/**", "/payment/**")
                            .permitAll()
                        .requestMatchers("/cart/**", "/support/**")
                            .hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/admin/**")
                            .hasRole("ADMIN")
                        .anyRequest().authenticated()
                );

        return http.build();

    }//SecurityFilterChain Bean


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

        configuration.setAllowedOrigins(List.of("http://localhost:3030"));
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));

        configuration.setAllowedHeaders(List.of(
                "Authorization","Content-Type","X-XSRF-TOKEN",
                "X-Requested-With","Accept","Origin"
        ));
        configuration.setAllowCredentials(true); // ✅ HttpOnly 쿠키 받으려면 필요
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 회원가입 시 호출 --> 비밀번호 암호화 설정 (PasswordEncoder)
    // Spring Security는 반드시 비밀번호를 암호화하여 저장하고 비교해야 함!!
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}//SecurityConfig class


