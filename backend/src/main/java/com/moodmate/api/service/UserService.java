package com.moodmate.api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.UserDTO.*;
import com.moodmate.api.entity.GoogleAccount;
import com.moodmate.api.entity.User;
import com.moodmate.api.repository.GoogleAccountRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.NoArgsConstructor;

@Service
@NoArgsConstructor
public class UserService {

    private GoogleAccountRepository googleRepository;
    private UserRepository userRepository;

    @Transactional
    public UserResponseDTO createUser(UserCreationDTO dto) throws RuntimeException {
        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedEmail(dto.getEmail());

        if(existAccount.isPresent())
            throw new RuntimeException("Member Already Exist: "+ dto.getEmail());

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
    public UserResponseDTO readUserByUsername(String username) {
        Optional<User> existUser = userRepository.findByUsername(username);

        if(existUser.isEmpty())
            return null;
        else
            return UserResponseDTO.fromEntity(existUser.get());        
    }

    @Transactional
    public List<UserResponseDTO> readUserByname(String name) {
        List<User> existUser = userRepository.findByName(name);

        return existUser.stream()
            .map(UserResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUser(UserResponseDTO dto) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(dto.getId());

        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");
        
        User updatedUser = User.builder()
            .id(dto.getId())
            .email(dto.getEmail())
            .username(dto.getUsername())
            .refreshToken(dto.getRefreshToken())
            .role(dto.getRole())
            .name(dto.getName())
            .createdAt(dto.getCreatedAt())
            .modifiedAt(LocalDateTime.now())
            .build();

        return UserResponseDTO.fromEntity(userRepository.save(updatedUser));
    }

//   @Transactional
//   public UserResponseDTO updateUserToken(UserResponseDTO dto) throws RuntimeException {
//       Optional<User> existUser = userRepository.findById(dto.getId());
//
//       if(existUser.isEmpty())
//           throw new RuntimeException("Cannot Find User");
//   }

    @Transactional
    public void deleteUser(Long id) throws RuntimeException {
        Optional<User> existUser = userRepository.findById(id);

        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User with DB ID: " + id);
        
         Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedUser(existUser.get());

        if(existAccount.isPresent())
            googleRepository.delete(existAccount.get());

        userRepository.delete(existUser.get());
    }
}
