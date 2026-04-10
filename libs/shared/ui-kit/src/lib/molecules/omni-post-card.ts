import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmniPost } from '@omni-nexus/shared-models';

@Component({
  selector: 'lib-omni-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './omni-post-card.html',
  styleUrl: './omni-post-card.scss',
})
export class OmniPostCardComponent {
  post = input.required<OmniPost>();

  platformClass = computed(() => `platform-${this.post().platform}`);

  formattedDate = computed(() => {
    const timestamp = this.post().timestamp;
    const d = new Date(timestamp);
    return d.toLocaleString();
  });
}
