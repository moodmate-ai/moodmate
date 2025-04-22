package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.GoogleAccount;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class GoogleAccountDTO {
    
    private Long id;
    private Long userId;
    private String connectedId;
    private LocalDateTime connectedAt;

    @Builder
    public GoogleAccountDTO(Long id, Long userId, String connectedId, LocalDateTime connectedAt) {
        this.id = id;
        this.userId = userId;
        this.connectedId = connectedId;
        this.connectedAt = connectedAt;
    }

    public static GoogleAccountDTO fromEntity(GoogleAccount googleAccount) {
        Long userId = googleAccount.getConnectedUser().getId();

        return GoogleAccountDTO.builder()
            .id(googleAccount.getId())
            .userId(userId)
            .connectedId(googleAccount.getConnectedId())
            .connectedAt(googleAccount.getConnectedAt())
            .build();
    }
}
