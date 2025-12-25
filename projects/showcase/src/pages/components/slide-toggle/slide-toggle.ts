import { Component } from '@angular/core';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';

@Component({
  selector: 'app-slide-toggle',
  imports: [
    CuteCheckbox,
    CuteTooltip,
    CuteVStack
  ],
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.scss',
})
export class SlideTogglePage {
  disabledOption: boolean = false;
}
