import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {CuteStepperModule} from "@cute-widgets/base/stepper";
import {CuteFormFieldModule} from "@cute-widgets/base/form-field";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CuteButtonModule} from "@cute-widgets/base/button";
import {CuteInputModule} from "@cute-widgets/base/input";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@Component({
  selector: 'stepper-with-error',
  templateUrl: './stepper-with-error.html',
  styleUrls: ['./stepper-with-error.scss'],
  exportAs: 'stepperWithError',
  host: {},
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    ReactiveFormsModule,
    CuteStepperModule,
    CuteFormFieldModule,
    CuteButtonModule,
    CuteInputModule,
  ]
})
export class StepperWithErrorComponent /* extends ... */ {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor() {}

}
