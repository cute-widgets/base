import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {SingleFormWizardComponent} from './single-form-wizard/single-form-wizard';
import {StepperVerticalExample} from './vertical-stepper/vertical-stepper';
import {StepperWithErrorComponent} from './stepper-with-error/stepper-with-error';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-stepper',
  imports: [
    CuteVStack,
    SingleFormWizardComponent,
    StepperVerticalExample,
    StepperWithErrorComponent,
    ComponentHeader
  ],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class StepperPage {

}
