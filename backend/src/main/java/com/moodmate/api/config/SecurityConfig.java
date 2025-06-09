package com.moodmate.api.config;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import com.moodmate.api.service.JwtAuthService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtDecoder jwtDecoder() {

        // JwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(issuerUri).build();

        // return new JwtDecoder() {
        //     @Override
        //     public Jwt decode(String token) throws JwtException {
        //         System.out.println("token: " + token);
        //         Jwt jwt = jwtDecoder.decode(token);
        //         System.out.println("jwt: " + jwt);
        //         return jwt;
        //     }
        // };
        // Use Google's JWK Set URI instead of issuer URI
        String googleJwkSetUri = "https://www.googleapis.com/oauth2/v3/certs";
        
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(googleJwkSetUri).build();
        
        return new JwtDecoder() {
            @Override
            public Jwt decode(String token) throws JwtException {
                System.out.println("Decoding token: " + token.substring(0, Math.min(50, token.length())) + "...");
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    System.out.println("JWT Subject: " + jwt.getSubject());
                    System.out.println("JWT Issuer: " + jwt.getIssuer());
                    return jwt;
                } catch (JwtException e) {
                    System.err.println("JWT decoding failed: " + e.getMessage());
                    throw e;
                }
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all origins for development (you should restrict this in production)
        configuration.addAllowedOriginPattern("*");
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
        
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);
        
        // Expose common headers to the client
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(auth -> auth.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .formLogin(auth -> auth.disable())
            .httpBasic(auth -> auth.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> 
                authorize.requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()
                .requestMatchers(
                    "/**",
                    "/api/v1/user/create",
                    "/api/v1/user/searchemail/**",
                    "/login",
                    "/api/chat/**",
                    "/swagger-ui/**",
                    "/swagger-resources/**",
                    "/api-docs"
                )
                .permitAll()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(new JwtAuthService())
                )
            );
            // .oauth2ResourceServer(oauth2 -> oauth2
            //     .jwt(jwt -> jwt
            //         .jwtAuthenticationConverter(new JwtAuthService())
            //     )
            // );


        return http.build();
    }
}