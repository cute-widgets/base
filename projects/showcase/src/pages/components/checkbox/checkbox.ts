import { Component } from '@angular/core';
import {CuteCheckboxModule} from '@cute-widgets/base/checkbox';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-checkbox',
  imports: [
    CuteCheckboxModule,
    CuteTooltipModule,
    CuteVStack,
    ComponentHeader,
  ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxPage extends AbstractPage {
  disabledOption: boolean = false;
}
