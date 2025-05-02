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

import com.moodmate.api.dto.UserDTO.UserCreationDTO;
import com.moodmate.api.dto.UserDTO.UserResponseDTO;
import com.moodmate.api.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService usersvc;
    
    // CREATE METHOD

    @PostMapping("/create")
    @Operation()
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserCreationDTO dto) {
        UserResponseDTO res = usersvc.createUser(dto);

        return ResponseEntity.ok(res);
    }

    // READ METHODS

    @GetMapping("/searchid/{userId}")
    @Operation(
        summary = "DB에서 자동생성되는 ID로 찾기"
    )
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        UserResponseDTO res = usersvc.readUserById(userId);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/searchuser/{username}")
    @Operation(
        summary = "유저네임(닉네임)으로 찾기"
    )
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        UserResponseDTO res = usersvc.readUserByUsername(username);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/checkusername/{username}")
    @Operation(
        summary = "유저네임이 이미 존재하는지 확인하기"
    )
    public ResponseEntity<String> checkUserByUsername(@PathVariable String username) {
        UserResponseDTO res = usersvc.readUserByUsername(username);

        if(res == null)
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok("Already Taken");
    }

    @GetMapping("/searchname/{name}")
    @Operation()
    public ResponseEntity<List<UserResponseDTO>> getUserByName(@PathVariable String name) {
        List<UserResponseDTO> res = usersvc.readUserByName(name);

        return ResponseEntity.ok(res);
    }

    // UPDATE METHOD

    @PutMapping("/update")
    @Operation()
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserResponseDTO dto) {
        UserResponseDTO res = usersvc.updateUser(dto);

        return ResponseEntity.ok(res);
    }

    // DELETE METHOD

    @DeleteMapping("/delete/{userId}")
    @Operation()
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        usersvc.deleteUser(userId);

        return ResponseEntity.ok("Successfully Deleted");
    }

}