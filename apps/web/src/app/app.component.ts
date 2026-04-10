import { Component, signal } from '@angular/core';
import { OmniPostCardComponent } from '@omni-nexus/shared-ui-kit';
import { OmniPost } from '@omni-nexus/shared-models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OmniPostCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  posts = signal<OmniPost[]>([
    {
      id: '1',
      platform: 'reddit',
      originalId: 'r1',
      author: {
        handle: 'u/antigravity',
        displayName: 'Antigravity AI',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=antigravity'
      },
      content: {
        text: 'Scaffolded the OmniNexus architecture using Nx, Angular 21, and Signals!',
        aiSummary: 'Successfully initialized a high-performance monorepo with dedicated UI Kit and Normalization layers.'
      },
      metrics: {
        likes: 1337,
        comments: 42
      },
      timestamp: Date.now(),
      rawPayload: {}
    },
    {
      id: '2',
      platform: 'x',
      originalId: 'x1',
      author: {
        handle: 'google_ai',
        displayName: 'Google DeepMind',
        avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=deepmind',
        verified: true
      },
      content: {
        text: 'The future of social media is unified. OmniNexus leverages the latest in AI Logic and Firestore Enterprise Native Mode. #AI #Angular',
      },
      metrics: {
        likes: 50400,
        shares: 8200
      },
      timestamp: Date.now() - 3600000,
      rawPayload: {}
    },
    {
      id: '3',
      platform: 'discord',
      originalId: 'd1',
      author: {
        handle: 'NexusDev',
        displayName: 'Nexus Development Council',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nexus'
      },
      content: {
        text: 'New Webhook integrated. All systems operational.',
      },
      metrics: {},
      timestamp: Date.now() - 7200000,
      rawPayload: {}
    }
  ]);
}
