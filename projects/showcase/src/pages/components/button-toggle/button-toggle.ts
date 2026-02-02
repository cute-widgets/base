import { Component } from '@angular/core';
import {CuteButtonToggleModule} from '@cute-widgets/base/button-toggle';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';

@Component({
  selector: 'app-button-toggle',
  imports: [
    CuteButtonToggleModule,
    ComponentHeader,
    CuteHStack,
    CuteCheckbox,
    CuteTooltip,
  ],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss',
})
export class ButtonTogglePage extends AbstractPage {

}
