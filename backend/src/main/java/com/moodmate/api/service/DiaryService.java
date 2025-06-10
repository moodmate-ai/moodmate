package com.moodmate.api.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.DiaryDTO.DiaryRequestDTO;
import com.moodmate.api.dto.DiaryDTO.DiaryResponseDTO;
import com.moodmate.api.entity.Chat;
import com.moodmate.api.entity.Diary;
import com.moodmate.api.entity.User;
import com.moodmate.api.enumerated.Emotion;
import com.moodmate.api.repository.ChatRepository;
import com.moodmate.api.repository.ChatMessageRepository;
import com.moodmate.api.repository.DiaryRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiaryService {
    
    private final AIService aiService;
    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    public DiaryResponseDTO createDiary(DiaryRequestDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(dto.getUserId());
        
        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");

        String diaryId = UUID.randomUUID().toString();

        AIService.EmotionResponseDTO emotionResponse = aiService.generateEmotionResponse(
            dto.getUserId().toString(),
            diaryId,
            dto.getBody()
        );

        Diary diary = Diary.builder()
            .body(dto.getBody())
            .user(existUser.get())
            .aiResponse(emotionResponse.message)
            .emotion(Emotion.from(emotionResponse.emotion))
            .createdAt(dto.getCreatedAt())
            .build();

        diaryRepository.save(diary);
        return DiaryResponseDTO.fromEntity(diary);
    }

    @Transactional
    public DiaryResponseDTO readDiaryById(Long id) {
        Optional<Diary> existDiary = diaryRepository.findById(id);

        if(existDiary.isEmpty())
            return null;
        else
            return DiaryResponseDTO.fromEntity(existDiary.get());
    }

    @Transactional
    public List<DiaryResponseDTO> readDiaryByUserId(Long id) throws RuntimeException{
        Optional<User> existUser = userRepository.findById(id);
        
        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");

        List<Diary> existDiary = diaryRepository.findByUser(existUser.get());
        Collections.reverse(existDiary);
        
        return existDiary.stream()
            .map(DiaryResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public DiaryResponseDTO updateDiary(Long diaryId, DiaryRequestDTO dto) throws RuntimeException {
        Optional<Diary> existDiary = diaryRepository.findById(diaryId);
        Optional<User> existUser = userRepository.findById(dto.getUserId());

        if(existDiary.isEmpty() || existUser.isEmpty())
            throw new RuntimeException("Cannot Find Diary");
        
        existDiary.get().setBody(dto.getBody());
        // existDiary.get().setModifiedAt(LocalDateTime.now());
        // // Update the createdAt if provided (allows changing the diary date)
        // if (dto.getCreatedAt() != null) {
        //     existDiary.get().setCreatedAt(dto.getCreatedAt());
        // }

        return DiaryResponseDTO.fromEntity(existDiary.get());
    }

    @Transactional
    public void deleteDiary(Long id) throws RuntimeException {
        Optional<Diary> existDiary = diaryRepository.findById(id);

        if(existDiary.isEmpty())
            throw new RuntimeException("Cannot Find Diary");

        Chat chat = chatRepository.findById(id).orElse(null);
        if(chat != null) {
            chatMessageRepository.deleteByChatId(chat.getId());
            chatRepository.delete(chat);
        }

        diaryRepository.delete(existDiary.get());
    }
}
