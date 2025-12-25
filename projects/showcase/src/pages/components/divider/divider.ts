import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteDivider} from '@cute-widgets/base/divider';

@Component({
  selector: 'app-divider',
  imports: [
    CuteHStack,
    CuteDivider,
    CuteVStack
  ],
  templateUrl: './divider.html',
  styleUrl: './divider.scss',
})
export class DividerPage {

}
