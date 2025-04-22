package com.moodmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moodmate.api.entity.GoogleAccount;

public interface GoogleAccountRepository extends JpaRepository<GoogleAccount, Long> {
    
}
