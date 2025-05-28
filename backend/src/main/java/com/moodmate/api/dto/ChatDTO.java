package com.moodmate.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

public class ChatDTO {

    @Data
    @Builder
    @Getter
    @Setter
    public static class ChatMessageDTO {
        @Schema(
                name = "role",
                description = "메시지 역할",
                type = "String",
                requiredMode = Schema.RequiredMode.REQUIRED,
                example = "user"
        )
        private String role;

        @Schema(
                name = "content",
                description = "메시지 내용",
                type = "String",
                requiredMode = Schema.RequiredMode.REQUIRED,
                example = "안녕하세요"
        )
        private String content;
    }

    @Data
    @Builder
    @Getter
    @Setter
    public static class RequestDTO{
        @Schema(
                name = "userId",
                description = "사용자 ID",
                type = "Long",
                requiredMode = Schema.RequiredMode.REQUIRED,
                example = "1"
        )
        private Long userId;

        @Schema(
                name = "diaryId",
                description = "일기 ID",
                type = "Long",
                requiredMode = Schema.RequiredMode.REQUIRED,
                example = "1"
        )
        private Long diaryId;

        @Schema(
                name = "messages",
                description = "메시지 목록",
                type = "List",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        private List<ChatMessageDTO> messages;
    }

    @Data
    @Builder
    @Getter
    @Setter
    public static class ResponseDTO {
        @Schema(
                name = "userMessage",
                description = "사용자가 보낸 메시지",
                type = "String",
                example = "안녕하세요"
        )
        private String userMessage;

        @Schema(
                name = "botReply",
                description = "챗봇이 보낸 응답",
                type = "String",
                example = "안녕하세요"
        )
        private String botReply;
    }

}
