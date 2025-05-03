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

import com.moodmate.api.dto.DiaryDTO.DiaryRequestDTO;
import com.moodmate.api.dto.DiaryDTO.DiaryResponseDTO;
import com.moodmate.api.service.DiaryService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/diary")
public class DiaryController {
    private final DiaryService diarysvc;

    @PostMapping("/create")
    @Operation(
        summary = "Diary 생성"
    )
    public ResponseEntity<DiaryResponseDTO> createDiary(@RequestBody DiaryRequestDTO dto) {        
        DiaryResponseDTO res = diarysvc.createDiary(dto);
        
        return ResponseEntity.ok(res);
    }
    
    @GetMapping("/searchid/{diaryId}")
    @Operation(
        summary = "DB에서 자동생성되는 ID로 찾기"
    )
    public ResponseEntity<DiaryResponseDTO> getDiaryById(@PathVariable Long diaryId) {
        DiaryResponseDTO res = diarysvc.readDiaryById(diaryId);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/searchuserid/{userId}")
    @Operation(
        summary = "User ID로 찾기"
    )
    public ResponseEntity<List<DiaryResponseDTO>> getDiaryByUserId(@PathVariable Long userId) {
        List<DiaryResponseDTO> res = diarysvc.readDiaryByUserId(userId);

        return ResponseEntity.ok(res);
    }

    @PutMapping("/update/{diaryId}")
    @Operation(
        summary = "Diary 데이터 변경"
    )
    public ResponseEntity<DiaryResponseDTO> updateDiary(@PathVariable Long diaryId, @RequestBody DiaryRequestDTO dto) {
        DiaryResponseDTO res = diarysvc.updateDiary(diaryId, dto);

        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/delete/{diaryId}")
    @Operation(
        summary = "Diary 삭제"
    )
    public ResponseEntity<String> deleteUser(@PathVariable Long diaryId) {
        diarysvc.deleteDiary(diaryId);

        return ResponseEntity.ok("Successfully Deleted");
    }


}
