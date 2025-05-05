package com.moodmate.api.di;
import java.sql.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DatabaseConfiguration {
    @Bean
    public Connection jdbcConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:postgresql://localhost:5432/moodmate", "moodmate", "moodmate");
    }
}
