package com.moodmate.api.dto;

import com.moodmate.api.entity.User;
import com.moodmate.api.enumerated.Role;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data

public class UserDTO {
    
    private Long id;
    private String name;
    private Role role;
    private LocalDateTime createdAt;

    @Builder
    public UserDTO(Long id, String name, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .role(user.getRole())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
