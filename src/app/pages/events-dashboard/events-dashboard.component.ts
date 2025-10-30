import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { API_BASE } from '../../config/api.config';

type BackendEvent = {
  id: string;
  type: string;
  payload: string;
  timestamp: string; // ISO from backend LocalDateTime
};

@Component({
  selector: 'app-events-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  events: BackendEvent[] = [];

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    this.isLoading = true;
    this.error = null;
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status})`);
      }
      const data = await res.json();
      this.events = (data as BackendEvent[])
        .map(e => ({ ...e }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (err: any) {
      this.error = err?.message || 'Unexpected error loading events';
    } finally {
      this.isLoading = false;
    }
  }

  tryParsePayload(payload: string): any {
    const trimmed = (payload || '').trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return payload; // fallback to raw
      }
    }
    return payload;
  }
}


