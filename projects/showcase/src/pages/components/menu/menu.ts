import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteMenuModule, CuteMenuTrigger} from '@cute-widgets/base/menu';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteDividerModule} from '@cute-widgets/base/divider';
import {CuteMenuItem} from '@cute-widgets/base/menu';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from '../../component-viewer/component-viewer';

@Component({
  selector: 'app-menu',
    imports: [
        CuteHStack,
        CuteVStack,
        CuteMenuModule,
        CuteButtonModule,
        CuteIconModule,
        CuteDividerModule,
        ComponentViewer,
      CuteMenuTrigger,
    ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuPage extends AbstractPage {

  onMenuItemClick(event: Event, mi: CuteMenuItem) {
    alert("You click on ["+mi.getLabel()+"] item.")
  }

}
