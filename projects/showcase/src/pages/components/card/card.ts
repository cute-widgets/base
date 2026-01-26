import { Component } from '@angular/core';
import { CuteCardModule } from '@cute-widgets/base/card';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-card',
  imports: [
    CuteCardModule,
    CuteButton,
    CuteHStack,
    CuteListModule,
    CuteCheckbox,
    CuteVStack,
    ComponentHeader,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardPage {

}
