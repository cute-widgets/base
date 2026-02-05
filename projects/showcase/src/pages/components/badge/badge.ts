import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteBadge} from '@cute-widgets/base/badge';
import {CuteButton} from '@cute-widgets/base/button';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from "../../component-viewer/component-viewer";

@Component({
  selector: 'app-badge',
    imports: [
        CuteVStack,
        CuteBadge,
        CuteButton,
        ComponentViewer
    ],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class BadgePage extends AbstractPage {

}
