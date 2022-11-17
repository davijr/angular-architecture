import { TestBed } from '@angular/core/testing';

import { GlAccountService } from './gl-account.service';

describe('GlAccountService', () => {
  let service: GlAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
