import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFormWizard } from './single-form-wizard';

describe('SingleFormWizard', () => {
  let component: SingleFormWizard;
  let fixture: ComponentFixture<SingleFormWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleFormWizard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleFormWizard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
