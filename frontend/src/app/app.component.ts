// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizationComponent } from './visualization/visualization.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, VisualizationComponent],
  template: `<app-visualization></app-visualization>`
})
export class AppComponent { }