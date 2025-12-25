import { Component } from '@angular/core';
import {CuteProgressSpinner} from '@cute-widgets/base/spinner';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';

@Component({
  selector: 'app-progress-spinner',
  imports: [
    CuteProgressSpinner,
    CuteHStack,
    CuteVStack
  ],
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.scss',
})
export class ProgressSpinnerPage {

}
