package com.voicetotrace.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;

@Service
public class SpeechToTextService {

    public static class TranscriptionResult {
        public final String transcript;
        public final float confidence;
        public TranscriptionResult(String transcript, float confidence) {
            this.transcript = transcript;
            this.confidence = confidence;
        }
    }

    public TranscriptionResult transcribeAudio(String filePath) throws IOException {
        try (SpeechClient speechClient = SpeechClient.create()) {
            byte[] data = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath));
            ByteString audioBytes = ByteString.copyFrom(data);

            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                    .setLanguageCode("en-US")
                    .build();

            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            RecognizeResponse response = speechClient.recognize(config, audio);
            StringBuilder transcriptBuilder = new StringBuilder();
            float confidence = 0.0f;

            for (SpeechRecognitionResult result : response.getResultsList()) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                transcriptBuilder.append(alternative.getTranscript());
                confidence = alternative.getConfidence();
            }

            return new TranscriptionResult(transcriptBuilder.toString(), confidence);
        }
    }
}