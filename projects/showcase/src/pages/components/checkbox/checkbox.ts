import { Component } from '@angular/core';
import {CuteCheckboxModule} from '@cute-widgets/base/checkbox';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';

@Component({
  selector: 'app-checkbox',
  imports: [
    CuteCheckboxModule,
    CuteTooltipModule,
    CuteVStack,
  ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxPage {
  disabledOption: boolean = false;
}
