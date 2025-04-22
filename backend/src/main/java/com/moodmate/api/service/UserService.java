package com.moodmate.api.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.UserDTO;
import com.moodmate.api.enumerated.Role;
import com.moodmate.api.repository.GoogleAccountRepository;
import com.moodmate.api.repository.UserRepository;

@Service
public class UserService {

    private GoogleAccountRepository googleRepository;
    private UserRepository userRepository;

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {

    }

    @Transactional
    public UserDTO readUser(Long id) {
       
    }

    @Transactional
    public UserDTO updateUser() {

    }

    @Transactional
    public void deleteUser() {

    }
}
