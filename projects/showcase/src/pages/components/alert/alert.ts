import { Component } from '@angular/core';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteAlertModule} from '@cute-widgets/base/alert';
import {CuteIcon} from '@cute-widgets/base/icon';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-alert',
  imports: [
    // CuteHStack,
    CuteAlertModule,
    CuteIcon,
    ComponentHeader,
  ],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class AlertPage {
  successAlertShow: boolean = true;
  holyMessage: boolean = true;

  log(...msg: string[]) {
    console.log(...msg);
  }
}
