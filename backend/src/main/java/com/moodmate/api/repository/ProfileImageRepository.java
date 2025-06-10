package com.moodmate.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moodmate.api.entity.ProfileImage;
import com.moodmate.api.entity.User;


public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {

    Optional<ProfileImage> findByUser(User user);

}
