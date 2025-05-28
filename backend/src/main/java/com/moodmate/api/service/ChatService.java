package com.moodmate.api.service;

import com.moodmate.api.dto.ChatDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.repository.ChatRepository;
import com.moodmate.api.repository.DiaryRepository;
import com.moodmate.api.repository.UserRepository;
import com.moodmate.api.service.AIService;
import com.moodmate.api.entity.User;
import com.moodmate.api.entity.Diary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    private final AIService aiService;


    public ChatDTO.ResponseDTO processUserMessage(ChatDTO.RequestDTO requestDTO) {
        // User user = userRepository.findById(requestDTO.getUserId())
        //         .orElseThrow(()-> new RuntimeException("User not found"));

        List<ChatDTO.ChatMessageDTO> messages = requestDTO.getMessages();

        AIService.ChatResponseDTO response = aiService.generateChatResponse(
            "1",//user.getUserId().toString(),
            requestDTO.getDiaryId().toString(),
            messages
        );
    
        // chatRepository.save(chat);

        return ChatDTO.ResponseDTO.builder()
                .userMessage(messages.get(messages.size() - 1).getContent())
                .botReply(response.content)
                .build();

    }

    public List<Chat> getChatsByDiary(Long diaryId) {
        return chatRepository.findByDiary_DiaryId(diaryId);
    }

}
