package com.moodmate.api.service;

import com.moodmate.api.dto.ChatDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.repository.ChatMessageRepository;
import com.moodmate.api.repository.ChatRepository;
import com.moodmate.api.repository.DiaryRepository;
import com.moodmate.api.repository.UserRepository;
import com.moodmate.api.entity.User;
import com.moodmate.api.entity.Diary;
import com.moodmate.api.entity.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;

    private final AIService aiService;


    public ChatDTO.ResponseDTO processUserMessage(ChatDTO.RequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        Diary diary = diaryRepository.findById(requestDTO.getDiaryId())
                .orElseThrow(()-> new RuntimeException("Diary not found"));

        List<ChatDTO.ChatMessageDTO> messages = requestDTO.getMessages();

        System.out.println(messages.get(0).getContent());

        AIService.ChatResponseDTO response = aiService.generateChatResponse(
            user.getUserId().toString(),
            requestDTO.getDiaryId().toString(),
            messages
        );

        // Upsert logic: Check if Chat already exists for this diary
        Optional<Chat> existingChatOpt = chatRepository.findById(requestDTO.getDiaryId());
        
        if (existingChatOpt.isPresent()) {
            // Update existing chat - using manual deletion approach
            Chat chat = existingChatOpt.get();
            List<ChatMessage> chatMessages = chat.getMessages();
            chatMessages.stream().forEach(
                message -> chatMessageRepository.delete(message)
            );
            chatRepository.delete(chat);
        }
        
        Chat chat = Chat.builder()
            .user(user)
            .diary(diary)
            .timestamp(LocalDateTime.now())
            .build();


        List<ChatMessage> chatMessages = IntStream.range(0, messages.size())
            .mapToObj(i -> ChatMessage.builder()
                    .role(messages.get(i).getRole())
                    .content(messages.get(i).getContent())
                    .number(Long.valueOf(i))
                    .chat(chat)
                    .build())
            .collect(Collectors.toList());

        chat.setMessages(chatMessages);

        chatRepository.save(chat);

        return ChatDTO.ResponseDTO.builder()
                .userMessage(messages.get(messages.size() - 1).getContent())
                .botReply(response.content)
                .build();
    }

    public List<ChatDTO.ChatMessageDTO> getChatMessageByDiary(Long diaryId) {

        List<ChatMessage> chatMessages = chatMessageRepository.findByChatId(diaryId);

        if (chatMessages.isEmpty()) {
            return new ArrayList<>();
        }

        return chatMessages.stream()
            .map(message -> ChatDTO.ChatMessageDTO.builder()
                .role(message.getRole())
                .content(message.getContent())
                .build())
            .collect(Collectors.toList());
    }

}
