package com.moodmate.api.config;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.Password;

@Component
public class JwtProvider {

    @Value("${spring.application.name}")
    private String issuer;

    @Value("${jwt.access-token-expire}")
    private Long accessExpires;

    @Value("${jwt.refresh-token-expire}")
    private Long refreshExpires;

    private final Password secretKey;

    public JwtProvider(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.password(secret.toCharArray());
    }

    public String createAccessToken(Long userId, String loginedWith) {
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + accessExpires);
        
        return Jwts.builder()
            .claims()
                .issuer(issuer)
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .subject("Moodmate Access Token")
                .add("userid", userId)
                .add("loginedWith", loginedWith)
                .and()
            .signWith(secretKey, Jwts.SIG.HS256)
            .compact();
    }

    public String createRefreshToken(Long userId, String username) {
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + refreshExpires);
        
        return Jwts.builder()
            .claims()
                .issuer(issuer)
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .subject("Moodmate Refresh Token")
                .add("userid", userId)
                .add("username", username)
                .and()
            .signWith(secretKey, Jwts.SIG.HS256)
            .compact();
    }

    public Claims verifyToken(String compactJws) {
        Jws<Claims> jwt;

        try {
            jwt = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(compactJws);

        } catch (JwtException e) {
            return null;
        }
        
        return jwt.getPayload();
    }

}
