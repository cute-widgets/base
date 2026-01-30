import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteBadge} from '@cute-widgets/base/badge';
import {CuteButton} from '@cute-widgets/base/button';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-badge',
  imports: [
    CuteVStack,
    CuteBadge,
    CuteButton,
    ComponentHeader
  ],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class BadgePage extends AbstractPage {

}
