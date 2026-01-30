import { Component } from '@angular/core';
import {CuteAlertModule} from '@cute-widgets/base/alert';
import {CuteIcon} from '@cute-widgets/base/icon';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';

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
export class AlertPage extends AbstractPage {
  successAlertShow: boolean = true;
  holyMessage: boolean = true;

  constructor() {
    super();


  }

  log(...msg: string[]) {
    console.log(...msg);
  }

}
