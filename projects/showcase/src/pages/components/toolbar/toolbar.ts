import { Component } from '@angular/core';
import {CuteToolbarModule} from '@cute-widgets/base/toolbar';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteIconModule} from '@cute-widgets/base/icon';

@Component({
  selector: 'app-toolbar',
  imports: [
    CuteToolbarModule,
    CuteVStack,
    CuteButtonModule,
    CuteIconModule,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class ToolbarPage {

}
