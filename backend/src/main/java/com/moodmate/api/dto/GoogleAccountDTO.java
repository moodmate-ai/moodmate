package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.GoogleAccount;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class GoogleAccountDTO {
    
    private Long id;
    private Long connectedUserId;
    private String connectedEmail;
    private LocalDateTime connectedAt;

    @Builder
    public GoogleAccountDTO(Long id, Long connectedUserId, String connectedEmail, LocalDateTime connectedAt) {
        this.id = id;
        this.connectedUserId = connectedUserId;
        this.connectedEmail = connectedEmail;
        this.connectedAt = connectedAt;
    }

    public static GoogleAccountDTO fromEntity(GoogleAccount googleAccount) {
        Long userId = googleAccount.getConnectedUser().getId();

        return GoogleAccountDTO.builder()
            .id(googleAccount.getId())
            .connectedUserId(userId)
            .connectedEmail(googleAccount.getConnectedEmail())
            .connectedAt(googleAccount.getConnectedAt())
            .build();
    }
}
