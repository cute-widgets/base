import { Component } from '@angular/core';
import {CuteButtonToggleModule} from '@cute-widgets/base/button-toggle';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-button-toggle',
  imports: [
    CuteButtonToggleModule,
    ComponentHeader,
  ],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss',
})
export class ButtonTogglePage extends AbstractPage {

}
