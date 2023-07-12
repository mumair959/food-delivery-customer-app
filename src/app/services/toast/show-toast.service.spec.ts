import { TestBed } from '@angular/core/testing';

import { ShowToastService } from './show-toast.service';

describe('ShowToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShowToastService = TestBed.get(ShowToastService);
    expect(service).toBeTruthy();
  });
});
