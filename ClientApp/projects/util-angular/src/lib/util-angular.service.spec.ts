import { TestBed } from '@angular/core/testing';

import { UtilAngularService } from './util-angular.service';

describe('UtilAngularService', () => {
  let service: UtilAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
