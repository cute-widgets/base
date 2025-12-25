import { Component } from '@angular/core';
import { CuteButtonModule} from '@cute-widgets/base/button';
import {CuteHStack, CuteStack} from '@cute-widgets/base/layout';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteProgressSpinner} from '@cute-widgets/base/spinner';
import {CuteTabsModule} from '@cute-widgets/base/tabs';

@Component({
  selector: 'app-button-page',
  imports: [
    CuteButtonModule,
    CuteIconModule,
    CuteHStack,
    CuteTooltipModule,
    CuteStack,
    CuteProgressSpinner,
    CuteTabsModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonPage {

}
