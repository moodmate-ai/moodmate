package com.moodmate.api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@Table(name = "google_account")
public class GoogleAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long id;

    @OneToOne(optional = false)
    private User connectedUser;

    @Column(name="connected_id")
    private String connectedId;

    @Column(name="connected_at", nullable = false)
    private LocalDateTime connectedAt;

    public GoogleAccount(User connectedUser, String connectedId, LocalDateTime connectedAt) {
        this.connectedUser = connectedUser;
        this.connectedId = connectedId;
        this.connectedAt = connectedAt;
    }
}
