package com.moodmate.api.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.UserDTO.ProfileImageDTO;
import com.moodmate.api.entity.ProfileImage;
import com.moodmate.api.entity.User;

import com.moodmate.api.repository.ProfileImageRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileImageService {
    
    private final UserRepository userRepo;
    private final ProfileImageRepository imageRepo;

    @Transactional
    public ProfileImageDTO createProfileImage(ProfileImageDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepo.findById(dto.getUserId());
     
        if(existUser.isPresent())
            throw new RuntimeException("User Image Data Already Exist");

        ProfileImage image = ProfileImage.builder()
            .user(existUser.get())
            .image(dto.getImage())
            .build();

        imageRepo.save(image);
        return ProfileImageDTO.fromEntity(image);
    }

    @Transactional
    public ProfileImageDTO readProfileImageByUserId(Long userId) {
        Optional<User> existUser = userRepo.findById(userId);

        if(existUser.isEmpty())
            throw new RuntimeException("User Not Exist");

        Optional<ProfileImage> existImage = imageRepo.findByUser(existUser.get());
     
        if(existImage.isEmpty())
            return createProfileImage(ProfileImageDTO.builder()
                .userId(userId)
                .image(null)
                .build());
        else
            return ProfileImageDTO.fromEntity(existImage.get());
    }
    
    @Transactional
    public ProfileImageDTO updateProfileImage(ProfileImageDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepo.findById(dto.getUserId());

        if(existUser.isEmpty())
            throw new RuntimeException("User Not Exist");

        Optional<ProfileImage> existImage = imageRepo.findByUser(existUser.get());

        if(existImage.isEmpty())
            throw new RuntimeException("User Image Not Exist");

        existImage.get().setImage(dto.getImage());

        return ProfileImageDTO.fromEntity(existImage.get());
    }   

    @Transactional
    public void deleteProfileImageByUserId(Long userId) throws RuntimeException {
        Optional<User> existUser = userRepo.findById(userId);

        if(existUser.isEmpty())
            throw new RuntimeException("User Not Exist");

        Optional<ProfileImage> existImage = imageRepo.findByUser(existUser.get());
        
        imageRepo.delete(existImage.get());
    }

}
