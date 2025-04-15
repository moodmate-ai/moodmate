package com.moodmate.api.entity;

import java.time.LocalDateTime;

import com.moodmate.api.enumerated.Provider;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique=true, nullable=false)
    private Long id;

    @Column(nullable=false, length=20)
    private String name;

    @Column
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column
    private String identifier;

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    
    public User(Long id, String name, Provider provider, String identifier, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.provider = provider;
        this.identifier = identifier;
        this.createdAt = createdAt;
    }

}
