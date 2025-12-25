import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup, FormsModule, ReactiveFormsModule,
} from '@angular/forms';
import {CuteStepperModule} from "@cute-widgets/base/stepper";
import {CuteIcon} from "@cute-widgets/base/icon";
import {JsonPipe, NgIf} from "@angular/common";
import {CuteButtonModule} from "@cute-widgets/base/button";
import {StepperOrientation} from "@angular/cdk/stepper";
import {StepperLabelPosition} from "@cute-widgets/base/stepper";

@Component({
    selector: 'single-form-wizard',
    templateUrl: './single-form-wizard.html',
    styleUrls: ['./single-form-wizard.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CuteStepperModule,
        JsonPipe,
        CuteButtonModule,
    ]
})
export class SingleFormWizardComponent implements OnInit {
  @Input()
  isLinear = true;

  @Input()
  isEditable = true;

  @Input()
  orientation: StepperOrientation = "horizontal";

  @Input()
  labelPosition: StepperLabelPosition = "end";

  frmValues: object = {};

  frmStepper!: FormGroup;

  get formArray(): AbstractControl {
    return this.frmStepper.get('steps')!;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frmStepper = this.fb.group({
      steps: this.fb.array([
        this.fb.group({
          firstName: ['First Name', Validators.compose([Validators.required])],
          lastName: ['Last Name', Validators.compose([Validators.required])],
          phone: [null], // optional
          email: [
            'johndoe@example.com',
            Validators.compose([Validators.required, Validators.email]),
          ],
        }),
        this.fb.group({
          addressOne: [null, Validators.compose([Validators.required])],
          addressTwo: [null], // optional
          city: [null, Validators.compose([Validators.required])],
          county: [null, Validators.compose([Validators.required])],
          country: [null, Validators.compose([Validators.required])],
        }),
        this.fb.group({
          creditCardNo: [
            '4111 1111 1111 1111',
            Validators.compose([Validators.required]),
          ],
          expiryDate: ['', Validators.compose([Validators.required])],
          cvvCode: ['', Validators.compose([Validators.required])],
        }),
      ]),
    });
  }

  submit(): void {
    console.log(this.frmStepper.value);
    this.frmValues = this.frmStepper.value;
  }
}
