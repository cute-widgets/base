import { Component } from '@angular/core';
import {CuteProgressSpinner} from '@cute-widgets/base/spinner';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {ComponentViewer} from '../../component-viewer/component-viewer';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-progress-spinner',
  imports: [
    CuteProgressSpinner,
    CuteHStack,
    CuteVStack,
    ComponentViewer
  ],
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.scss',
})
export class ProgressSpinnerPage extends AbstractPage {}
