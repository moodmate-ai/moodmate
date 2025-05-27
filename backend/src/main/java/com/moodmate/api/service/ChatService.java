package com.moodmate.api.service;

import com.moodmate.api.dto.ChatDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.repository.ChatRepository;
import com.moodmate.api.repository.DiaryRepository;
import com.moodmate.api.repository.UserRepository;
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

    @Value("${app.services.ai-api.chat-url}")
    private final String chatUrl;
    //private final RestTemplate restTemplate;
    // private final DiaryRepository diaryRepository;

    public ChatDTO.ResponseDTO processUserMessage(ChatDTO.RequestDTO requestDTO) {
        // User user = userRepository.findById(requestDTO.getUserId())
        //         .orElseThrow(()-> new RuntimeException("User not found"));

        List<ChatDTO.ChatMessageDTO> messages = requestDTO.getMessages();
        // String userMessage = messages.get(messages.size() - 1).getContent();
        // String botReply = generateDummyReply(userMessage);

        // Chat chat = Chat.builder()
        //         .user(user)
        //         .userMessage(userMessage)
        //         .botReply(botReply)
        //         .timestamp(LocalDateTime.now())
        //         .build();

        // chatRepository.save(chat);

        return ChatDTO.ResponseDTO.builder()
                .userMessage(messages.get(messages.size() - 1).getContent())
                .botReply(generateResponse(messages))
                .build();
    }

    public List<Chat> getChatsByDiary(Long diaryId) {
        return chatRepository.findByDiary_DiaryId(diaryId);
    }

    private String generateResponse(List<ChatDTO.ChatMessageDTO> messages) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8000/v1/chat/completion";
        Map<String, Object> requestDTO = new HashMap<>();
        /*
        {
            "user_id": "string",
            "diary_id": "string",
            "messages": [
              {
                "role": "string",
                "content": "string"
              }
            ]
          }
        */
        requestDTO.put("user_id", "string");
        requestDTO.put("diary_id", "string");
        requestDTO.put("messages", messages);
        return restTemplate.postForObject(url, requestDTO, String.class);
    }

    private String generateDummyReply(String message) {
        if (message.contains("우울")) return "그랬군요. 많이 힘드셨겠어요.";
        if (message.contains("행복")) return "행복한 일이 있으셨군요! 너무 좋네요.";
        return "그 이야기를 들어줘서 고마워요. 계속 이야기해 주세요.";
    }
}
