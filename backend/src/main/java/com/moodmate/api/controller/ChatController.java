package com.moodmate.api.controller;

import com.moodmate.api.dto.ChatDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "Chat conversation endpoints")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    @Operation(
        summary = "Process user chat message",
        description = "Sends a user message to the chat service and returns a response"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully processed message"),
        @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<ChatDTO.ResponseDTO> chat(@RequestBody ChatDTO.RequestDTO requestDTO) {
        ChatDTO.ResponseDTO response = chatService.processUserMessage(requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/diary/{diaryId}")
    @Operation(
        summary = "Get chat history for a diary",
        description = "Retrieves the complete chat history for a specific diary"
    )
    public ResponseEntity<List<Chat>> getChatsByDiary(
        @Parameter(description = "ID of the diary") @PathVariable Long diaryId
    ) {
        return ResponseEntity.ok(chatService.getChatsByDiary(diaryId));
    }
}