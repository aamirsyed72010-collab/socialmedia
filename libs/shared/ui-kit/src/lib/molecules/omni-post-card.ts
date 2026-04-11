import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NektNode, NektCategory } from '@omni-nexus/shared-models';

@Component({
  selector: 'lib-omni-post-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="nekt-card-container" [class]="categoryClass()" [class.is-thread]="isThread()">
  <!-- Minimalist Header -->
  <header class="card-header">
    <div class="author-info">
      <div class="status-glyph" [class]="categoryIcon()"></div>
      <span class="handle">@{{ node().author.handle }}</span>
    </div>
    <span class="timestamp">{{ formattedDate() }}</span>
  </header>

  <!-- High-Density Content Area -->
  <main class="card-body">
    <p class="content-text" *ngIf="node().content.text">{{ node().content.text }}</p>
    
    <div class="media-container" *ngIf="node().content.mediaUrl">
      <img *ngIf="node().content.mediaType === 'image'" [src]="node().content.mediaUrl" loading="lazy">
      <div *ngIf="node().content.mediaType === 'video'" class="video-placeholder">
        <div class="play-indicator"></div>
      </div>
    </div>
  </main>

  <!-- Defragmented Footer -->
  <footer class="card-footer" *ngIf="node().metrics?.priorityScore">
    <div class="priority-indicator">
      <span class="label">Priority</span>
      <div class="bar">
        <div class="fill" [style.width.%]="node().metrics?.priorityScore || 0"></div>
      </div>
    </div>
  </footer>
</div>
`,
  styleUrl: './omni-post-card.scss',
})
export class OmniPostCardComponent {
  node = input.required<NektNode>();

  categoryClass = computed(() => `category-${this.node().category.toLowerCase()}`);
  
  isThread = computed(() => this.node().category === NektCategory.COMMUNAL && this.node().content.isThread);
  
  categoryIcon = computed(() => {
    switch (this.node().category) {
      case NektCategory.COMMUNAL: return 'circle';
      case NektCategory.VISUALS: return 'square';
      case NektCategory.SYNAPSE: return 'triangle';
      default: return 'none';
    }
  });

  formattedDate = computed(() => {
    const timestamp = this.node().timestamp;
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp));
  });
}
