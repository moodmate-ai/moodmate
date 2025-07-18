package com.moodmate.api.repository;

import com.moodmate.api.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Modifying
    @Transactional
    void deleteByChatId(Long chatId);

    List<ChatMessage> findByChatId(Long chatId);
}
