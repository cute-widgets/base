import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteDivider} from '@cute-widgets/base/divider';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-divider',
    imports: [
        CuteHStack,
        CuteDivider,
        CuteVStack,
        ComponentViewer
    ],
  templateUrl: './divider.html',
  styleUrl: './divider.scss',
})
export class DividerPage extends AbstractPage {}
