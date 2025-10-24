package com.voicetotrace.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audio_records")
public class AudioRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String filePath;
    private LocalDateTime createdAt;

    public AudioRecord() {
        this.createdAt = LocalDateTime.now();
    }

    public AudioRecord(Long userId, String filePath) {
        this.userId = userId;
        this.filePath = filePath;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}