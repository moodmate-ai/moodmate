package com.moodmate.api.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moodmate.api.dto.GoogleAccountDTO;
import com.moodmate.api.entity.GoogleAccount;
import com.moodmate.api.entity.User;
import com.moodmate.api.repository.GoogleAccountRepository;
import com.moodmate.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// 직접적으로 노출되지 않으므로, CRUD 연산 중 UPDATE 연산을 작성하지 않습니다.
// 연결된 계정을 변경하려면 기존 연결을 삭제하고 새로 작성해야 합니다.
@Service
@RequiredArgsConstructor
public class GoogleAccountService {
    
    private final UserRepository userRepository;
    private final GoogleAccountRepository googleRepository;

    @Transactional
    public GoogleAccountDTO createGoogleAccount(GoogleAccountDTO dto) throws RuntimeException {
        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedEmail(dto.getConnectedEmail());
        Optional<User> existUser = userRepository.findById(dto.getConnectedUserId());

        if(existAccount.isPresent())
            throw new RuntimeException("Already Connected E-Mail");

        if(existUser.isEmpty())
            throw new RuntimeException("User Not Exist");

        GoogleAccount google = GoogleAccount.builder()
            .connectedUser(existUser.get())
            .connectedEmail(dto.getConnectedEmail())
            .connectedAt(LocalDateTime.now())
            .build();

        googleRepository.save(google);
        return GoogleAccountDTO.fromEntity(google);
    }   
    
    @Transactional
    public GoogleAccountDTO readGoogleAccountByUserId(Long id) {
        Optional<User> existUser = userRepository.findById(id);

        if(existUser.isEmpty())
            throw new RuntimeException("Cannot Find User");

        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedUser(existUser.get());

        if(existAccount.isEmpty())
            return null;
        else
            return GoogleAccountDTO.fromEntity(existAccount.get());

    }

    @Transactional
    public GoogleAccountDTO readGoogleAccountByEmail(String email) {
        Optional<GoogleAccount> existAccount =  googleRepository.findByConnectedEmail(email);

        if(existAccount.isEmpty())
            return null;
        else
            return GoogleAccountDTO.fromEntity(existAccount.get());

    }

    @Transactional
    public void deleteGoogleAccount(Long id) {
        Optional<GoogleAccount> existAccount =  googleRepository.findById(id);

        if(existAccount.isEmpty())
            throw new RuntimeException("Cannot find Connected Account");
        
        googleRepository.delete(existAccount.get());
    }

}
