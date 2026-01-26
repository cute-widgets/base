import { Component } from '@angular/core';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-slide-toggle',
  imports: [
    CuteCheckbox,
    CuteTooltip,
    CuteVStack,
    ComponentHeader
  ],
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.scss',
})
export class SlideTogglePage {
  disabledOption: boolean = false;
}
