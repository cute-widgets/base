import { Component } from '@angular/core';
import {CuteButtonToggleModule} from '@cute-widgets/base/button-toggle';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-button-toggle',
  imports: [
    CuteButtonToggleModule,
    ComponentHeader,
    // CuteVStack
  ],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss',
})
export class ButtonTogglePage {

}
