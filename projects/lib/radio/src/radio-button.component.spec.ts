/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {CuteRadioButton} from './radio-button.component';

describe('RadioButtonComponent', () => {
  let component: CuteRadioButton;
  let fixture: ComponentFixture<CuteRadioButton>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuteRadioButton ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuteRadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
