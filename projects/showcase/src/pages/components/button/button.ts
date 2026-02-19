import { Component } from '@angular/core';
import { CuteButtonModule} from '@cute-widgets/base/button';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteProgressSpinner} from '@cute-widgets/base/spinner';
import {CuteTabsModule} from '@cute-widgets/base/tabs';
import {ThemeColor} from '@cute-widgets/base/core';
import {RelativeSize5} from '@cute-widgets/base/core/types';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {FormsModule} from '@angular/forms';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {CuteRadioModule} from '@cute-widgets/base/radio';
import {TitleCasePipe} from '@angular/common';
import {CuteLabel} from '@cute-widgets/base/form-field';

@Component({
  selector: 'app-button-page',
  imports: [
    CuteButtonModule,
    CuteIconModule,
    CuteHStack,
    CuteTooltipModule,
    CuteProgressSpinner,
    CuteTabsModule,
    CuteCheckbox,
    FormsModule,
    ComponentViewer,
    CuteRadioModule,
    TitleCasePipe,
    CuteLabel
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonPage extends AbstractPage {

  protected colors: ThemeColor[] = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark", "link"];

  protected sizes: RelativeSize5[] = ["smaller", "small", "middle", "large", "larger"];

  protected reversedSizes = [...this.sizes].reverse();

  protected applyGradient: boolean = false;
  protected applyDisabled: boolean = false;
  protected selectedSize: RelativeSize5 = "middle";

}
