// src/app/visualization/visualization.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../safe-url.pipe';
import { VisualizationService } from '../visualization.service';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeUrlPipe,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent {
  language: string = 'python';
  code: string = '';
  visUrl: string = '';
  errorMessage: string = '';

  constructor(private visService: VisualizationService) { }

  generateVisualization() {
    this.errorMessage = '';
    this.visService.generateVisualization(this.language, this.code)
      .subscribe({
        next: (response: any) => {
          this.visUrl = response.visUrl;
        },
        error: (error: any) => {
          this.errorMessage = 'Error generating visualization. Please check your code.';
          console.error('Generation error: ', error);
        }
      });
  }
}