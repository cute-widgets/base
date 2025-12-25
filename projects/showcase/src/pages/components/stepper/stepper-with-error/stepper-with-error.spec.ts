import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperWithError } from './stepper-with-error';

describe('StepperWithError', () => {
  let component: StepperWithError;
  let fixture: ComponentFixture<StepperWithError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperWithError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperWithError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
