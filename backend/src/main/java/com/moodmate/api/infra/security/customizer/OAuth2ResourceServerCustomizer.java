package com.moodmate.api.infra.security.customizer;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;

public class OAuth2ResourceServerCustomizer implements Customizer<OAuth2ResourceServerConfigurer<HttpSecurity>>{

    public static OAuth2ResourceServerCustomizer jwt(JwtDecoder jwtDecoder) {
        return customizer -> customizer.jwt(jwt -> jwt.decoder(jwtDecoder));
    }

    @Override
    public void customize(OAuth2ResourceServerConfigurer<HttpSecurity> customizer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'customize'");
    }

}
