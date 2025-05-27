package com.moodmate.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;

import java.util.List;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(APIInfo())
            .servers(List.of(
                new Server().url("/").description("Default Server URL")
            ))
            .components(new Components()
                .addSecuritySchemes("bearer-jwt", 
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token authentication")))
            .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }

    private Info APIInfo() {
        return new Info()
            .title("Moodmate API Documentation")
            .description("API Reference for the Moodmate application - a mood tracking and journaling platform")
            .version("1.0")
            .contact(new Contact()
                .name("Moodmate Team")
                .email("support@moodmate.example.com")
                .url("https://moodmate.example.com"))
            .license(new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT"));
    }
}