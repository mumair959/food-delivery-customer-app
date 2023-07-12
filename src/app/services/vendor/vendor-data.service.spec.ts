import { TestBed } from '@angular/core/testing';

import { VendorDataService } from './vendor-data.service';

describe('VendorDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorDataService = TestBed.get(VendorDataService);
    expect(service).toBeTruthy();
  });
});
