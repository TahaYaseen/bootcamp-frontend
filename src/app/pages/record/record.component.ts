import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent {
  mediaRecorder?: MediaRecorder;
  audioChunks: Blob[] = [];
  audioUrl: string | null = null;
  isRecording = false;
  uploadStatus: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async startRecording() {
    this.audioChunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(blob);
      };
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  playAudio() {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }

  async uploadAudio() {
    if (!this.audioUrl) return;
    try {
      const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');
      formData.append('userId', '1');

      const token = sessionStorage.getItem('jwt');
      const response = await fetch('http://localhost:8081/api/v1/voice/record', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.uploadStatus = `Uploaded successfully. Record ID: ${data.recordId}`;
      } else {
        this.uploadStatus = 'Upload failed.';
      }
    } catch (error) {
      console.error('Upload error', error);
      this.uploadStatus = 'Upload error occurred.';
    }
  }

  async transcribeRecord(recordId: number) {
    try {
      const token = sessionStorage.getItem('jwt');
      const start = performance.now();
      const response = await fetch(`http://localhost:8081/api/v1/voice/transcribe?recordId=${recordId}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const end = performance.now();
      const latency = ((end - start) / 1000).toFixed(2);
      if (response.ok) {
        const data = await response.json();
        this.transcriptionText = data.text;
        this.transcriptId = data.transcriptId;
        this.uploadStatus = `Transcribed (Latency ${latency}s, Confidence ${data.confidence.toFixed(2)})`;
      } else {
        this.uploadStatus = `Transcription failed (Latency ${latency}s)`;
      }
      console.log('Transcription latency (s):', latency);
    } catch (err) {
      console.error('Transcription error', err);
      this.uploadStatus = 'Error during transcription.';
    }
  }

  transcriptionText: string | null = null;
  transcriptId: number | null = null;

  editTranscript(event: any) {
    this.transcriptionText = event.target.value;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
