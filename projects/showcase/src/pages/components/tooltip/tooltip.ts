import { Component } from '@angular/core';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteTooltipModule, TooltipPosition} from '@cute-widgets/base/tooltip';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CuteButtonModule} from '@cute-widgets/base/button';

@Component({
  selector: 'app-tooltip',
  imports: [
    ReactiveFormsModule,
    CuteHStack,
    CuteTooltipModule,
    CuteFormFieldModule,
    CuteSelectModule,
    CuteButtonModule,
  ],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class TooltipPage {
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
}
