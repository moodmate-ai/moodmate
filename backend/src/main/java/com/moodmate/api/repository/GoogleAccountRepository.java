package com.moodmate.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moodmate.api.entity.GoogleAccount;
import com.moodmate.api.entity.User;

public interface GoogleAccountRepository extends JpaRepository<GoogleAccount, Long> {
    
    Optional<GoogleAccount> findByConnectedEmail(String email);
    Optional<GoogleAccount> findByConnectedUser(User user);
}
