package com.moodmate.api.repository;

import com.moodmate.api.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    
}

