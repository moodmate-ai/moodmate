package com.moodmate.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moodmate.api.entity.Diary;
import com.moodmate.api.entity.User;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUser(User user);
}
