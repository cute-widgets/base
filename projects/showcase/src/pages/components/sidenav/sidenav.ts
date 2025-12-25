import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteSidenavModule} from '@cute-widgets/base/sidenav';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {FormsModule} from '@angular/forms';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteSelectModule} from '@cute-widgets/base/select';

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
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavPage {
  showFiller: boolean = false;
}
