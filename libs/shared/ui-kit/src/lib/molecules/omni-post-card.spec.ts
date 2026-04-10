import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OmniPostCard } from './omni-post-card';

describe('OmniPostCard', () => {
  let component: OmniPostCard;
  let fixture: ComponentFixture<OmniPostCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OmniPostCard],
    }).compileComponents();

    fixture = TestBed.createComponent(OmniPostCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
