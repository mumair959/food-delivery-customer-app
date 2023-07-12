import { TestBed } from '@angular/core/testing';

import { AddressDataService } from './address-data.service';

describe('AddressDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddressDataService = TestBed.get(AddressDataService);
    expect(service).toBeTruthy();
  });
});
