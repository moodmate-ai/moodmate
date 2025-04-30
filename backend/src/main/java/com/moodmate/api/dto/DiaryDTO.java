package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.User;
import com.moodmate.api.enumerated.Emotion;
import com.moodmate.api.entity.Diary;
import com.moodmate.api.entity.GoogleAccount;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


public class DiaryDTO {
    
    @Data
    @Getter
    @Setter
    @Builder
    public static class DiaryCreationDTO {
        private String body;
        private Long userId;
        private Emotion emotion;
    }
    
    @Data
    @Getter
    @Setter
    @Builder
    public static class DiaryResponseDTO {
        private Long id;
        private String body;
        private Long userId;
        private Emotion emotion;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;

        public static DiaryResponseDTO fromEntity(Diary diary) {
            return DiaryResponseDTO.builder()
                .id(diary.getId())
                .body(diary.getBody())
                .userId(diary.getUser().getId())
                .emotion(diary.getEmotion())
                .createdAt(diary.getCreatedAt())
                .modifiedAt(diary.getModifiedAt())
                .build();
        }
    }
}
