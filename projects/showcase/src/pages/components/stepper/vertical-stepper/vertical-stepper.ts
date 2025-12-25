import {Component, inject} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CuteButtonModule} from "@cute-widgets/base/button";
import {CuteStepperModule} from "@cute-widgets/base/stepper";
import {CuteFormFieldModule} from "@cute-widgets/base/form-field";
import {CuteInputModule} from "@cute-widgets/base/input";

/**
 * @title Stepper vertical
 */
@Component({
    selector: 'stepper-vertical-example',
    templateUrl: './vertical-stepper.html',
    styleUrl: './vertical-stepper.scss',
    imports: [
        CuteButtonModule,
        CuteStepperModule,
        FormsModule,
        ReactiveFormsModule,
        CuteFormFieldModule,
        CuteInputModule,
    ]
})
export class StepperVerticalExample {
  private _formBuilder: FormBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  constructor() {}
}
