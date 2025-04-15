package com.moodmate.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moodmate.api.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
