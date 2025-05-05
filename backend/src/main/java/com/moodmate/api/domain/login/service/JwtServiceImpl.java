package com.moodmate.api.domain.login.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

public class JwtServiceImpl implements JwtService {
    
    private final JwtEncoder encoder;
    private final String issuer;
    
    public JwtServiceImpl(JwtEncoder encoder, String issuer) {
        this.encoder = encoder;
        this.issuer = issuer;
    }
    
    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        
        // Extract roles/authorities for claims
        String scopes = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.joining(" "));
        
        // Build JWT claims
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))  // Token expires in 1 hour
                .subject(authentication.getName())
                .claim("scope", scopes)
                .build();
        
        // Encode and return the JWT
        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}