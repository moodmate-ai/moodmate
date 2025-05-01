package com.moodmate.api.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.DynamicUpdate;

import com.moodmate.api.enumerated.Emotion;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;

@Entity
@Builder
@Getter
@DynamicUpdate
@Table(name = "diary")
public class Diary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(length = 10000)
    private String body;

    @ManyToOne(optional = false)
    @Column(table = "user", name = "id")
    private User user;

    @Enumerated
    @Column
    private Emotion emotion;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime modifiedAt;

}
