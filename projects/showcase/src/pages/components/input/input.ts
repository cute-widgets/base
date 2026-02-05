import { Component } from '@angular/core';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {FormsModule} from '@angular/forms';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {ComponentViewer} from '../../component-viewer/component-viewer';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-input',
  imports: [
    FormsModule,
    CuteInputModule,
    CuteFormFieldModule,
    CuteIconModule,
    CuteButtonModule,
    CuteVStack,
    CuteHStack,
    ComponentViewer
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputPage extends AbstractPage {
  value = 'Clear me';
}
