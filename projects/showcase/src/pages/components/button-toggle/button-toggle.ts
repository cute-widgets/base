import { Component } from '@angular/core';
import {CuteButtonToggleModule} from '@cute-widgets/base/button-toggle';
import {AbstractPage} from '../abstract/abstract-page';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {ComponentViewer} from '../../component-viewer/component-viewer';

@Component({
  selector: 'app-button-toggle',
  imports: [
    CuteButtonToggleModule,
    CuteHStack,
    CuteCheckbox,
    CuteTooltip,
    ComponentViewer,
  ],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss',
})
export class ButtonTogglePage extends AbstractPage {

}
