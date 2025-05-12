package com.moodmate.api.service;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

public class JwtAuthService implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        return new JwtAuthenticationToken(jwt, authorities);
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Map<String, Object> claims = jwt.getClaims();
        
        // Extract roles from JWT claims - can be customized based on your token structure
        if (claims.containsKey("roles")) {
            Collection<?> roles = (Collection<?>) claims.get("roles");
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        }
        
        // Extract scopes from JWT claims
        if (claims.containsKey("scope") || claims.containsKey("scp")) {
            Object scopeObj = claims.getOrDefault("scope", claims.get("scp"));
            Collection<?> scopes;
            
            if (scopeObj instanceof String) {
                scopes = Collections.singletonList(scopeObj);
            } else if (scopeObj instanceof Collection) {
                scopes = (Collection<?>) scopeObj;
            } else {
                return Collections.emptyList();
            }
            
            return scopes.stream()
                    .map(scope -> new SimpleGrantedAuthority("SCOPE_" + scope))
                    .collect(Collectors.toList());
        }
        
        return Collections.emptyList();
    }
}