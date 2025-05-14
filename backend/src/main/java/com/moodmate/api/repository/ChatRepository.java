package com.moodmate.api.repository;

import com.moodmate.api.entity.Chat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByDiary_DiaryId(Long diaryId);
}

