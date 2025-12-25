/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CuteButton } from './button.component';

describe('CuteButtonComponent', () => {
  let component: CuteButton;
  let fixture: ComponentFixture<CuteButton>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CuteButton ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuteButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
