import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStepper } from './vertical-stepper';

describe('VerticalStepper', () => {
  let component: VerticalStepper;
  let fixture: ComponentFixture<VerticalStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
