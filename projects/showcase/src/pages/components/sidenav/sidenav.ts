import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteSidenavModule} from '@cute-widgets/base/sidenav';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {FormsModule} from '@angular/forms';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-sidenav',
    imports: [
        FormsModule,
        CuteVStack,
        CuteHStack,
        CuteSidenavModule,
        CuteButtonModule,
        CuteFormFieldModule,
        CuteSelectModule,
        ComponentViewer,
    ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavPage extends AbstractPage {
  showFiller: boolean = false;
}
