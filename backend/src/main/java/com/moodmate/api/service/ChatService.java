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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    public ChatDTO.ResponseDTO processUserMessage(ChatDTO.RequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));
        Diary diary = diaryRepository.findById(requestDTO.getDiaryId())
                .orElseThrow(() -> new RuntimeException("Diary not fund"));

        String userMessage = requestDTO.getMessage();
        String botReply = generateDummyReply(userMessage);

        Chat chat = Chat.builder()
                .user(user)
                .diary(diary)
                .userMessage(userMessage)
                .botReply(botReply)
                .timestamp(LocalDateTime.now())
                .build();

        chatRepository.save(chat);

        return ChatDTO.ResponseDTO.builder()
                .userMessage(userMessage)
                .botReply(botReply)
                .build();
    }

    public List<Chat> getChatsByDiary(Long diaryId) {
        return chatRepository.findByDiary_DiaryId(diaryId);
    }

    private String generateDummyReply(String message) {
        if (message.contains("우울")) return "그랬군요. 많이 힘드셨겠어요.";
        if (message.contains("행복")) return "행복한 일이 있으셨군요! 너무 좋네요.";
        return "그 이야기를 들어줘서 고마워요. 계속 이야기해 주세요.";
    }
}
