package com.moodmate.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moodmate.api.dto.UserDTO.ProfileImageDTO;
import com.moodmate.api.dto.UserDTO.UserRequestDTO;
import com.moodmate.api.dto.UserDTO.UserResponseDTO;
import com.moodmate.api.service.ProfileImageService;
import com.moodmate.api.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService usersvc;
    private final ProfileImageService imgsvc;

    // CREATE METHOD

    @PostMapping("/create")
    @Operation(
        summary = "User 생성"
    )
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO dto) {
        System.out.println("createUser: " + dto);
        UserResponseDTO res = usersvc.createUser(dto);
        System.out.println("createUser: " + res);
        
        imgsvc.createProfileImage(ProfileImageDTO.builder()
            .userId(res.getUserId())
            .image(null)
            .build());

        return ResponseEntity.ok(res);
    }

    // READ METHODS

    @GetMapping("/searchid/{userId}")
    @Operation(
        summary = "DB에서 자동생성되는 ID로 찾기"
    )
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        System.out.println("getUserById: " + userId);
        UserResponseDTO res = usersvc.readUserById(userId);
        System.out.println("getUserById: " + res);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/searchemail/{email}")
    @Operation(
        summary = "이메일로 찾기"
    )
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        System.out.println("getUserByEmail: " + email);
        UserResponseDTO res = usersvc.readUserByEmail(email);
        System.out.println("getUserByEmail: " + res);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/searchuser/{username}")
    @Operation(
        summary = "유저네임(닉네임)으로 찾기"
    )
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        System.out.println("getUserByUsername: " + username);
        UserResponseDTO res = usersvc.readUserByUsername(username);
        System.out.println("getUserByUsername: " + res);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/checkusername/{username}")
    @Operation(
        summary = "유저네임이 이미 존재하는지 확인하기"
    )
    public ResponseEntity<String> checkUserByUsername(@PathVariable String username) {
        System.out.println("checkUserByUsername: " + username);
        UserResponseDTO res = usersvc.readUserByUsername(username);
        System.out.println("checkUserByUsername: " + res);
        if(res == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok("Already Taken");
    }

    @GetMapping("/searchname/{name}")
    @Operation(
        summary = "이름으로 찾기"
    )
    public ResponseEntity<List<UserResponseDTO>> getUserByName(@PathVariable String name) {
        System.out.println("getUserByName: " + name);
        List<UserResponseDTO> res = usersvc.readUserByName(name);
        System.out.println("getUserByName: " + res);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/image/{userId}")
    @Operation(
        summary = "프로필 이미지 불러오기"
    )
    public ResponseEntity<ProfileImageDTO> getProfileImage(@PathVariable Long userId) {
        ProfileImageDTO res = imgsvc.readProfileImageByUserId(userId);

        return ResponseEntity.ok(res);
    }

    // UPDATE METHOD

    @PutMapping("/update/{userId}")
    @Operation(
        summary = "User 데이터 변경 - RefreshToken은 여기서 노출되지도 변경되지도 않습니다"
    )
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long userId, @RequestBody UserRequestDTO dto) {
        System.out.println("updateUser: " + userId + " " + dto);
        UserResponseDTO res = usersvc.updateUser(userId, dto);
        System.out.println("updateUser: " + res);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/updateimage")
    @Operation(
        summary = "프로필 이미지 변경"
    )
    public ResponseEntity<ProfileImageDTO> updateProfileImage(@RequestBody ProfileImageDTO dto) {
        ProfileImageDTO res = imgsvc.updateProfileImage(dto);

        return ResponseEntity.ok(res);
    }

    // DELETE METHOD

    @DeleteMapping("/delete/{userId}")
    @Operation(
        summary = "User 및 연동된 계정정보 삭제"
    )
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        System.out.println("deleteUser: " + userId);
        usersvc.deleteUser(userId);
        System.out.println("deleteUser: Successfully Deleted");
        return ResponseEntity.ok("Successfully Deleted");
    }

}