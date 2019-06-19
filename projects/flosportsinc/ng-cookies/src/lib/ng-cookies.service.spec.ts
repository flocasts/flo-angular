import { TestBed } from '@angular/core/testing';

import { NgCookiesService } from './ng-cookies.service';

describe('NgCookiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgCookiesService = TestBed.get(NgCookiesService);
    expect(service).toBeTruthy();
  });
});
