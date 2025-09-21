import { TestBed } from '@angular/core/testing';

import { HiddenStarService } from './hidden-star.service';
describe('HiddenStarService', () => {
  let service: HiddenStarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiddenStarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
