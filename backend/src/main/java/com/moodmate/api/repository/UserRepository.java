package com.moodmate.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moodmate.api.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    List<User> findByName(String name);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

}
