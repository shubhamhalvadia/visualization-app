// src/app/visualization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  // Adjust the URL if your backend host/port changes.
  private apiUrl = 'http://localhost:3000/api/generate';

  constructor(private http: HttpClient) { }

  generateVisualization(language: string, code: string): Observable<any> {
    const payload = { language, code };
    return this.http.post(this.apiUrl, payload);
  }
}