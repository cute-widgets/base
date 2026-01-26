import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteDivider} from '@cute-widgets/base/divider';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-divider',
  imports: [
    CuteHStack,
    CuteDivider,
    CuteVStack,
    ComponentHeader
  ],
  templateUrl: './divider.html',
  styleUrl: './divider.scss',
})
export class DividerPage {

}
