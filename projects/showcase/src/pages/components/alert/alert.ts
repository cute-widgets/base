import { Component } from '@angular/core';
import {CuteAlertModule} from '@cute-widgets/base/alert';
import {CuteIcon} from '@cute-widgets/base/icon';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from '../../component-viewer/component-viewer';

@Component({
  selector: 'app-alert',
  imports: [
    CuteAlertModule,
    CuteIcon,
    ComponentViewer,
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
