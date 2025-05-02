package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.GoogleAccount;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter
@Setter
public class GoogleAccountDTO {
    
    private Long id;
    private Long connectedUserId;
    private String connectedEmail;
    private LocalDateTime connectedAt;

    public static GoogleAccountDTO fromEntity(GoogleAccount googleAccount) {
        Long userId = googleAccount.getConnectedUser().getUserId();

        return GoogleAccountDTO.builder()
            .id(googleAccount.getId())
            .connectedUserId(userId)
            .connectedEmail(googleAccount.getConnectedEmail())
            .connectedAt(googleAccount.getConnectedAt())
            .build();
    }
}
