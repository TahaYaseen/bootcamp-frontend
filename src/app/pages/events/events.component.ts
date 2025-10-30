import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface EventRecord {
  id: number;
  type: string;
  payload: string;
  timestamp: string;
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: EventRecord[] = [];
  loading = true;
  error: string | null = null;

  newEvent = { type: '', payload: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<EventRecord[]>('/api/events').subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  saveEvent(): void {
    console.log('Save event clicked:', this.newEvent);
    if (!this.newEvent.type || !this.newEvent.payload) {
      alert('Please enter both type and payload');
      return;
    }

    this.http.post<EventRecord>('/api/events', this.newEvent).subscribe({
      next: (res) => {
        console.log('Event saved successfully:', res);
        this.newEvent = { type: '', payload: '' };
        this.loadEvents();
      },
      error: (err) => {
        console.error('Failed to save event', err);
        alert('Failed to save event. Check backend connection.');
      }
    });
  }

  extractText = '';

  extractEventFromText(): void {
    if (!this.extractText.trim()) {
      alert('Please enter text to extract.');
      return;
    }

    console.log('Extracting event from text:', this.extractText);
    this.http.post<any>('/api/extract-event', { text: this.extractText }).subscribe({
      next: (data) => {
        console.log('Extracted structured event:', data);
        alert('Event extracted successfully and stored!');
        this.extractText = '';
        this.loadEvents();
      },
      error: (err) => {
        console.error('Extraction failed:', err);
        alert('Failed to extract event from text.');
      }
    });
  }
}