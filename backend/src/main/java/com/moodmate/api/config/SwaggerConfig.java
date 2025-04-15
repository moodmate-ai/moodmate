package com.moodmate.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;


@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(APIInfo());
    }

    private Info APIInfo() {
        return new Info()
            .title("Moodmate API Documentation")
            .description("API Reference")
            .version("1.0");

    }

}
