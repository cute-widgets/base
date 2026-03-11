import { Component } from '@angular/core';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteMenuModule} from '@cute-widgets/base/menu';

@Component({
  selector: 'context-menu-example',
  imports: [
    CuteIconModule,
    CuteMenuModule
  ],
  templateUrl: './context-menu-example.html',
  styleUrl: './context-menu-example.scss',
})
export class ContextMenuExample {

}
