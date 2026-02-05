import { Component } from '@angular/core';
import {CuteRadioModule} from '@cute-widgets/base/radio';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteCardModule} from '@cute-widgets/base/card';
import {CuteVStack} from '@cute-widgets/base/layout';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-radio-button',
    imports: [
        CuteRadioModule,
        CuteTooltipModule,
        CuteCardModule,
        CuteVStack,
        ComponentViewer,
    ],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss',
})
export class RadioButtonPage extends AbstractPage {}
