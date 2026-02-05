import { Component } from '@angular/core';
import {CuteCheckboxModule} from '@cute-widgets/base/checkbox';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from "../../component-viewer/component-viewer";

@Component({
  selector: 'app-checkbox',
    imports: [
        CuteCheckboxModule,
        CuteTooltipModule,
        CuteVStack,
        ComponentViewer,
    ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxPage extends AbstractPage {
  disabledOption: boolean = false;
}
