package com.voicetotrace.repository;

import com.voicetotrace.model.SpeechTranscript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpeechTranscriptRepository extends JpaRepository<SpeechTranscript, Long> {
    List<SpeechTranscript> findByAudioRecordId(Long audioRecordId);
}