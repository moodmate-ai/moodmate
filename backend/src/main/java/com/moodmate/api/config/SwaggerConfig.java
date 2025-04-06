package com.moodmate.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.models.GroupedOpenApi;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;


@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("springdoc-openapi")
                .version("1.0")
                .description("Swagger-ui Docs test screen"));
    }

    @Bean
    public GroupedOpenApi api() {
        String[] paths = {"/api/v1/**"};
        String[] packagesToScan = {"com.moodmate.api"};
        return GroupedOpenApi.builder().group("moodmate")
            .pathsToMatch(paths)
            .packagesToScan(packagesToScan)
            .build();
    }

}
