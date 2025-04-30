package com.moodmate.api.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.DynamicUpdate;

import com.moodmate.api.enumerated.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;


// Table user
// 유저 테이블입니다.
@Entity
@Builder
@Getter
@DynamicUpdate
@Table(name = "user")
public class User {

    // id
    // 가입순서에 따라 자동증가 전략으로 부여되는 PK 컬럼입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    // email
    // 연락용 이메일입니다. 이메일 연동은 별도의 테이블을 사용합니다.
    @Column(nullable = false)
    private String email;

    // username
    // 계정명입니다.
    @Column(nullable = false)
    private String username;

    // refreshtoken
    // JWT 리프레시 토큰입니다.
    @Column(length = 1000)
    private String refreshToken;

    // role
    // 유저 보안 수준입니다. ADMIN과 USER만 존재합니다. 공유 기능이 필요할 경우 role이 아닌 SecurityConfig을 변경하면 됩니다.
    @Enumerated
    @Column(nullable = false)
    private Role role;

    // name
    // 사용자의 이름입니다.
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime modifiedAt;
}
