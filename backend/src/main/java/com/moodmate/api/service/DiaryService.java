package com.moodmate.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.DiaryDTO.DiaryCreationDTO;
import com.moodmate.api.dto.DiaryDTO.DiaryResponseDTO;
import com.moodmate.api.entity.Diary;
import com.moodmate.api.entity.User;
import com.moodmate.api.repository.DiaryRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiaryService {
    
    private UserRepository userRepository;
    private DiaryRepository diaryRepository;

    @Transactional
    public DiaryResponseDTO createDiary(DiaryCreationDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(dto.getUserId());
        
        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");
    
        Diary diary = Diary.builder()
            .body(dto.getBody())
            .user(existUser.get())
            .createdAt(LocalDateTime.now())
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

        return existDiary.stream()
            .map(DiaryResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public DiaryResponseDTO updateDiary(DiaryResponseDTO dto) throws RuntimeException {
        Optional<Diary> existDiary = diaryRepository.findById(dto.getDiaryId());
        Optional<User> existUser = userRepository.findById(dto.getUserId());

        if(existDiary.isEmpty() || existUser.isEmpty())
            throw new RuntimeException("Cannot Find Diary");
        
        Diary updatedDiary = Diary.builder()
            .diaryId(dto.getDiaryId())
            .body(dto.getBody())
            .user(existUser.get())
            .emotion(dto.getEmotion())
            .createdAt(dto.getCreatedAt())
            .modifiedAt(LocalDateTime.now())
            .build();

        return DiaryResponseDTO.fromEntity(diaryRepository.save(updatedDiary));
    }

    @Transactional
    public void deleteDiary(Long id) throws RuntimeException {
        Optional<Diary> existDiary = diaryRepository.findById(id);

        if(existDiary.isEmpty())
            throw new RuntimeException("Cannot Find Diary");

        diaryRepository.delete(existDiary.get());
    }
}
