package com.voicetotrace.repository;

import com.voicetotrace.model.AudioRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AudioRecordRepository extends JpaRepository<AudioRecord, Long> {
    List<AudioRecord> findByUserId(Long userId);
}