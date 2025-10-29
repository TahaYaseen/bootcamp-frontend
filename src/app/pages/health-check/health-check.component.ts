import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent {
  healthStatus: string = 'Checking...';

  constructor(private http: HttpClient) {
    this.checkHealth();
  }

  checkHealth() {
    this.http.get(`https://bootcamp-backend-oq0i.onrender.com/health`, { responseType: 'text' })
      .subscribe({
        next: (res) => this.healthStatus = res,
        error: () => this.healthStatus = 'Server Unavailable'
      });
  }
}
