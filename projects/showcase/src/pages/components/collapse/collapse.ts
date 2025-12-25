import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteCardModule} from '@cute-widgets/base/card';
import {CuteCollapseModule} from '@cute-widgets/base/collapse';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';

@Component({
  selector: 'app-collapse',
  imports: [
    CuteHStack,
    CuteButtonModule,
    CuteCardModule,
    CuteCollapseModule,
    CuteVStack,
    CuteCheckbox,

  ],
  templateUrl: './collapse.html',
  styleUrl: './collapse.scss',
})
export class CollapsePage {

}
