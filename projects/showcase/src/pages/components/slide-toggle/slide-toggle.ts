import { Component } from '@angular/core';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-slide-toggle',
    imports: [
        CuteCheckbox,
        CuteTooltip,
        CuteVStack,
        ComponentViewer
    ],
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.scss',
})
export class SlideTogglePage extends AbstractPage {
  disabledOption: boolean = false;
}
