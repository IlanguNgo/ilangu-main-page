import { TestBed } from '@angular/core/testing';

import { ShadowsUnveiledService } from './shadows-unveiled.service';

describe('ShadowsUnveiledService', () => {
  let service: ShadowsUnveiledService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShadowsUnveiledService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
