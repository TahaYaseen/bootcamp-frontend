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
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream) {
        console.error('No audio stream available.');
        alert('Unable to access microphone. Please check browser permissions.');
        return;
      }
      console.log('Microphone access granted.');


      // Verify Web Audio API support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        alert('Your browser does not support Web Audio API.');
        return;
      }

      // Initialize AudioContext and Recorder
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream);

      if (!window.MediaRecorder) {
        alert('Your browser does not support audio recording.');
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      console.log('MediaRecorder initialized with state:', recorder.state);

      // Define audioChunks only once outside scope
      this.audioChunks = [];
      if (!recorder) {
        console.error('Failed to create MediaRecorder');
        alert('Your browser does not support MediaRecorder.');
        return;
      }
      // Use component's shared audioChunks for accessibility during stopRecording
      this.audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log('Audio chunk captured, total chunks:', this.audioChunks.length);
        }
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Check browser permissions.');
      };

      recorder.onstop = async () => {
        console.log('MediaRecorder stopped, finalizing audio...');
        if (!this.audioChunks || this.audioChunks.length === 0) {
          console.warn('No audio chunks found after stop.');
          this.isRecording = false;
          return;
        }

        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const offlineContext = new OfflineAudioContext(1, audioBuffer.length * (16000 / audioBuffer.sampleRate), 16000);
          const bufferSource = offlineContext.createBufferSource();
          bufferSource.buffer = audioBuffer;
          bufferSource.connect(offlineContext.destination);
          bufferSource.start(0);
          const renderedBuffer = await offlineContext.startRendering();

          const wavBlob = this.encodeWAV(renderedBuffer);
          this.audioUrl = URL.createObjectURL(wavBlob);
          this.audioChunks = [wavBlob];
          this.isRecording = false;

          console.log('Recording finalized and ready for playback/upload.');
        } catch (error) {
          console.error('Error finalizing recorded audio:', error);
          alert('Could not finalize audio recording.');
        }
      };

      recorder.start();
      this.mediaRecorder = recorder;
      this.isRecording = true;
      console.log('Recording started from browser mic at 16kHz');
    } catch (err) {
      console.error('Microphone access denied or error:', err);
    }
  }


  private encodeWAV(buffer: AudioBuffer): Blob {
    const channelData = buffer.getChannelData(0);
    const bufferLength = channelData.length * 2 + 44;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, str: string) =>
      [...str].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + channelData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 16000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, channelData.length * 2, true);

    let offset = 44;
    for (let i = 0; i < channelData.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  stopRecording() {
    if (!this.mediaRecorder) {
      console.warn('No active MediaRecorder instance to stop.');
      return;
    }

    if (this.isRecording) {
      console.log('Stopping MediaRecorder...');
      try {
        this.mediaRecorder.onstop = async () => {
          console.log('MediaRecorder stopped via stop button. Finalizing...');
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          if (audioBlob.size > 0) {
            this.audioUrl = URL.createObjectURL(audioBlob);
            this.audioChunks = [audioBlob];
            this.isRecording = false;
            console.log('Audio finalized and ready for playback/upload.');
          } else {
            console.warn('No audio data available on stop.');
          }
        };
        this.mediaRecorder.stop();
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err);
        alert('Failed to stop recording. Please try again.');
      }
    } else {
      console.warn('Recording is not active.');
    }
  }

  playAudio() {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }

  async uploadAudio() {
    if (!this.audioChunks || this.audioChunks.length === 0) {
      alert('No recorded audio found to upload.');
      return;
    }

    try {
      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      console.log('Preparing to upload audio file. Size (bytes):', blob.size);
      if (blob.size === 0) {
        alert('Recorded audio file is empty. Please record again.');
        return;
      }

      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('userId', '1');

      const token = sessionStorage.getItem('jwt');
      const baseUrl = 'https://voice-backend.onrender.com/api/v1/';
      const response = await fetch(`${baseUrl}voice/record`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        this.uploadStatus = `Uploaded successfully. Record ID: ${data.recordId}`;
        this.transcriptId = data.recordId?.toString().trim() || null;
        console.log('File successfully uploaded. Record ID:', this.transcriptId);
      } else {
        const text = await response.text();
        console.error('Upload failed. Server responded:', text);
        this.uploadStatus = `Upload failed. ${text}`;
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.uploadStatus = 'Unexpected upload error occurred.';
    }
  }

  async transcribeRecord(recordId?: any) {
    try {
      const token = sessionStorage.getItem('jwt');
      // Always use saved full recordId from upload
      const actualId = this.transcriptId ? this.transcriptId.toString().trim() : recordId?.toString().trim();
      console.log('Using recordId for transcription:', actualId);
      const start = performance.now();

      const response = await fetch(`https://voice-backend.onrender.com/api/v1/voice/transcribe?recordId=${encodeURIComponent(actualId)}`, {
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
