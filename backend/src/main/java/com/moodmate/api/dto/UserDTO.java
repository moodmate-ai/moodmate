package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.User;
import com.moodmate.api.enumerated.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public class UserDTO {
    
    @Data
    @Builder
    @Getter
    @Setter
    public static class UserRequestDTO {

        @Schema(
            name = "email",
            description = "기록할 E-mail",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "example@example"
        )
        private String email;

        @Schema(
            name = "username",
            description = "유저가 사이트에서 사용할 별명",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "username123"
        )
        private String username;

        @Schema(
            name = "role",
            description = "접근 수준. USER 또는 ADMIN.",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "USER"
        )
        private Role role;

        @Schema(
            name = "name",
            description = "이름. 공백 가능",
            type = "String",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "본명."
        )
        private String name;
    }

    @Data
    @Builder
    @Getter
    @Setter
    public static class UserResponseDTO {

        @Schema(
            name = "userId",
            description = "데이터베이스상의 User ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1"
        )
        private Long userId;

        @Schema(
            name = "email",
            description = "기록할 E-mail",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "example@example"
        )
        private String email;

        @Schema(
            name = "username",
            description = "유저가 사이트에서 사용할 별명",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "username123"
        )
        private String username;

        @Schema(
            name = "role",
            description = "접근 수준. USER 또는 ADMIN.",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "USER"
        )
        private Role role;

        @Schema(
            name = "name",
            description = "이름. 공백 가능",
            type = "String",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "본명."
        )
        private String name;

        @Schema(
            name = "createdAt",
            description = "작성 시간",
            type = "String",
            format = "date-time",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "2025-07-08T12:34:56Z"
        )
        private LocalDateTime createdAt;

        @Schema(
            name = "modifiedAt",
            description = "수정된 시간",
            type = "String",
            format = "date-time",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "2025-07-08T12:34:56Z"
        )
        private LocalDateTime modifiedAt;

        public static UserResponseDTO fromEntity(User user) {
            return UserResponseDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .modifiedAt(user.getModifiedAt())
                .build();
        }
    }
}
