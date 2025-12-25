/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CuteCheckbox } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CuteCheckbox;
  let fixture: ComponentFixture<CuteCheckbox>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuteCheckbox ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuteCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
