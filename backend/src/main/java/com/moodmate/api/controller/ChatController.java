package com.moodmate.api.controller;

import com.moodmate.api.dto.ChatDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatDTO.ResponseDTO> chat(@RequestBody ChatDTO.RequestDTO requestDTO) {
        ChatDTO.ResponseDTO response = chatService.processUserMessage(requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/diary/{diaryId}")
    public ResponseEntity<List<Chat>> getChatsByDiary(@PathVariable Long diaryId) {
        return ResponseEntity.ok(chatService.getChatsByDiary(diaryId));
    }
}
