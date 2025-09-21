import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowsunveiledComponent } from './shadowsunveiled.component';

describe('ShadowsunveiledComponent', () => {
  let component: ShadowsunveiledComponent;
  let fixture: ComponentFixture<ShadowsunveiledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShadowsunveiledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShadowsunveiledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
