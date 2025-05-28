package com.moodmate.api.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.moodmate.api.dto.ChatDTO;

@Service
public class AIService {
    
    private RestTemplate restTemplate;

    //@Value("${app.services.ai-api.chat-url}")
    private final String chatUrl;
    private final String emotionAnalysisUrl;

    public AIService() {
        this.restTemplate = new RestTemplate();
        this.chatUrl = "http://localhost:8000/v1/chat/completion";
        this.emotionAnalysisUrl = "http://localhost:8000/v1/diary/analyze";
    }


    public static class ChatResponseDTO {
        public String content;
    }

    public ChatResponseDTO generateChatResponse(
        String user_id,
        String diary_id,
        List<ChatDTO.ChatMessageDTO> messages
    ) {
        Map<String, Object> requestDTO = new HashMap<>();
        /*
        <request>
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
        <response>
        {
            "content": "string"  
        }
        */
        requestDTO.put("user_id", user_id);
        requestDTO.put("diary_id", diary_id);
        requestDTO.put("messages", messages);

        ChatResponseDTO response = restTemplate.postForObject(this.chatUrl, requestDTO, ChatResponseDTO.class);
        return response;
    }


    public static class EmotionResponseDTO {
        public String emotion;
        public String message;
    }

    public EmotionResponseDTO generateEmotionResponse(
        String user_id,
        String diary_id,
        String content
    ) {
        Map<String, Object> requestDTO = new HashMap<>();
        /*
        <request>
        {
            "user_id": "string",
            "diary_id": "string",
            "content": "string",
            "created_at": "string"
        }
        <response>
        {
            "content": "string"
        }
        */
        requestDTO.put("user_id", user_id);
        requestDTO.put("diary_id", diary_id);
        requestDTO.put("content", content);
        requestDTO.put("created_at", new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(new Date()));

        System.out.println(requestDTO);

        EmotionResponseDTO response = restTemplate.postForObject(this.emotionAnalysisUrl, requestDTO, EmotionResponseDTO.class);
        return response;
    }
    
}