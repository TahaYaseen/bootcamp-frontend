package com.voicetotrace.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "speech_transcripts")
public class SpeechTranscript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long audioRecordId;
    private String text;
    private float confidence;
    private LocalDateTime createdAt;

    public SpeechTranscript() {
        this.createdAt = LocalDateTime.now();
    }

    public SpeechTranscript(Long audioRecordId, String text, float confidence) {
        this.audioRecordId = audioRecordId;
        this.text = text;
        this.confidence = confidence;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getAudioRecordId() {
        return audioRecordId;
    }

    public void setAudioRecordId(Long audioRecordId) {
        this.audioRecordId = audioRecordId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public float getConfidence() {
        return confidence;
    }

    public void setConfidence(float confidence) {
        this.confidence = confidence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}