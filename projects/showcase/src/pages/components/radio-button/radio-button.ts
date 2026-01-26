import { Component } from '@angular/core';
import {CuteRadioModule} from '@cute-widgets/base/radio';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteCardModule} from '@cute-widgets/base/card';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-radio-button',
  imports: [
    CuteRadioModule,
    CuteTooltipModule,
    CuteCardModule,
    CuteVStack,
    ComponentHeader,
  ],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss',
})
export class RadioButtonPage {

}
