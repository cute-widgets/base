import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteMenuModule} from '@cute-widgets/base/menu';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteDividerModule} from '@cute-widgets/base/divider';
import {CuteMenuItem} from '@cute-widgets/base/menu';
import {CuteIconModule} from '@cute-widgets/base/icon';

@Component({
  selector: 'app-menu',
  imports: [
    CuteHStack,
    CuteVStack,
    CuteMenuModule,
    CuteButtonModule,
    CuteIconModule,
    CuteDividerModule,
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuPage {

  onMenuItemClick(event: Event, mi: CuteMenuItem) {
    alert("You click on ["+mi.getLabel()+"] item.")
  }

}
