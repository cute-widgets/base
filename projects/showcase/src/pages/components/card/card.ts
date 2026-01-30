import { Component } from '@angular/core';
import { CuteCardModule } from '@cute-widgets/base/card';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {CuteLabel} from '@cute-widgets/base/form-field';
import {toThemeColor} from '@cute-widgets/base/core';

@Component({
  selector: 'app-card',
  imports: [
    CuteCardModule,
    CuteButtonModule,
    CuteHStack,
    CuteListModule,
    CuteCheckbox,
    CuteVStack,
    ComponentHeader,
    CuteSelectModule,
    CuteLabel,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardPage {

  protected readonly toThemeColor = toThemeColor;
}
