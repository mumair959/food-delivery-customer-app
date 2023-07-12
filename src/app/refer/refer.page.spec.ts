import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferPage } from './refer.page';

describe('ReferPage', () => {
  let component: ReferPage;
  let fixture: ComponentFixture<ReferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
