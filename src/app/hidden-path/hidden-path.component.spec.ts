import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenPathComponent } from './hidden-path.component';

describe('HiddenPathComponent', () => {
  let component: HiddenPathComponent;
  let fixture: ComponentFixture<HiddenPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenPathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
