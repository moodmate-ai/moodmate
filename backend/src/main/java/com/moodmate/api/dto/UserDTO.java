package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.User;
import com.moodmate.api.enumerated.Role;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public class UserDTO {
    
    @Data
    @Builder
    @Getter
    @Setter
    public static class UserCreationDTO {
        private String email;
        private String username;
        private Role role;
        private String name;
    }

    @Data
    @Builder
    @Getter
    @Setter
    public static class UserResponseDTO {
        private Long id;
        private String email;
        private String username;
        private String refreshToken;
        private Role role;
        private String name;
        private LocalDateTime createdAt;

        public static UserResponseDTO fromEntity(User user) {
            return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .refreshToken(user.getRefreshToken())
                .role(user.getRole())
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .build();
        }
    }
}
