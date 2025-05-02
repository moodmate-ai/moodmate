package com.moodmate.api.dto;

import java.time.LocalDateTime;

import com.moodmate.api.entity.Diary;
import com.moodmate.api.enumerated.Emotion;

import io.swagger.v3.oas.annotations.media.Schema;
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
        @Schema(
            name = "body",
            description = "Diary 본문",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "일기의 내용."
        )
        private String body;

        @Schema(
            name = "userId",
            description = "작성 User ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1"
        )
        private Long userId;
    }
    
    @Data
    @Getter
    @Setter
    @Builder
    public static class DiaryResponseDTO {

        @Schema(
            name = "diaryId",
            description = "작성된 Diary ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "12"
        )
        private Long diaryId;

        @Schema(
            name = "body",
            description = "Diary 본문",
            type = "String",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "일기의 내용."
        )
        private String body;

        @Schema(
            name = "userId",
            description = "작성 User ID",
            type = "Long",
            requiredMode = Schema.RequiredMode.REQUIRED,
            example = "1"
        )
        private Long userId;

        @Schema(
            name = "emotion",
            description = "감정 정보",
            type = "String",
            requiredMode = Schema.RequiredMode.NOT_REQUIRED,
            example = "HAPPY"
        )
        private Emotion emotion;

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

        public static DiaryResponseDTO fromEntity(Diary diary) {
            return DiaryResponseDTO.builder()
                .diaryId(diary.getDiaryId())
                .body(diary.getBody())
                .userId(diary.getUser().getUserId())
                .emotion(diary.getEmotion())
                .createdAt(diary.getCreatedAt())
                .modifiedAt(diary.getModifiedAt())
                .build();
        }
    }
}
