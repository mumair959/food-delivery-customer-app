import { TestBed } from '@angular/core/testing';

import { VoucherService } from './voucher.service';

describe('VoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoucherService = TestBed.get(VoucherService);
    expect(service).toBeTruthy();
  });
});
