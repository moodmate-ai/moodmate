package com.moodmate.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.UserDTO.UserRequestDTO;
import com.moodmate.api.dto.UserDTO.UserResponseDTO;
import com.moodmate.api.entity.GoogleAccount;
import com.moodmate.api.entity.ProfileImage;
import com.moodmate.api.entity.User;
import com.moodmate.api.repository.GoogleAccountRepository;
import com.moodmate.api.repository.ProfileImageRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final GoogleAccountRepository googleRepository;
    private final UserRepository userRepository;
    private final ProfileImageRepository imageRepository;

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) throws RuntimeException {
        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedEmail(dto.getEmail());
        Optional<User> existUser = userRepository.findByUsername(dto.getUsername());
        
        if(existAccount.isPresent())
            throw new RuntimeException("User Already Exist With E-Mail: "+ dto.getEmail());

        if(existUser.isPresent())
            throw new RuntimeException("Username Already Taken");

        User user = User.builder()
            .email(dto.getEmail())
            .username(dto.getUsername())
            .role(dto.getRole())
            .name(dto.getName())
            .createdAt(LocalDateTime.now())
            .build();

        userRepository.save(user);
        return UserResponseDTO.fromEntity(user);
    }

    @Transactional
    public UserResponseDTO readUserById(Long id) {
        Optional<User> existUser = userRepository.findById(id);

        if(existUser.isEmpty())
            return null;
        else
            return UserResponseDTO.fromEntity(existUser.get());        
    }

    @Transactional
    public UserResponseDTO readUserByEmail(String email) {
        Optional<User> existUser = userRepository.findByEmail(email);

        if(existUser.isEmpty())
            return null;
        else
            return UserResponseDTO.fromEntity(existUser.get());        
    }

    @Transactional
    public UserResponseDTO readUserByUsername(String username) {
        Optional<User> existUser = userRepository.findByUsername(username);

        if(existUser.isEmpty())
            return null;
        else
            return UserResponseDTO.fromEntity(existUser.get());        
    }

    @Transactional
    public List<UserResponseDTO> readUserByName(String name) {
        List<User> existUser = userRepository.findByName(name);

        return existUser.stream()
            .map(UserResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUser(Long userId, UserRequestDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(userId);

        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");
        
        existUser.get().updatePersonal(dto.getEmail(), dto.getUsername(), dto.getName());
        existUser.get().setModifiedAt(LocalDateTime.now());
        
        return UserResponseDTO.fromEntity(existUser.get());
    }

    @Transactional
    public void deleteUser(Long id) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(id);

        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User with DB ID: " + id);
        
        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedUser(existUser.get());
        Optional<ProfileImage> existImage = imageRepository.findByUser(existUser.get());

        if(existAccount.isPresent())
            googleRepository.delete(existAccount.get());
        if(existImage.isPresent())
            imageRepository.delete(existImage.get());

        userRepository.delete(existUser.get());
    }
}
