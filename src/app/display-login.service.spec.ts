import { TestBed } from '@angular/core/testing';

import { DisplayLoginService } from './display-login.service';

describe('DisplayLoginService', () => {
  let service: DisplayLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
