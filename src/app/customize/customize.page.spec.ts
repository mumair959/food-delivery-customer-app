import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizePage } from './customize.page';

describe('CustomizePage', () => {
  let component: CustomizePage;
  let fixture: ComponentFixture<CustomizePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
