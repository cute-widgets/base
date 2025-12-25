import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteBadge} from '@cute-widgets/base/badge';
import {CuteButton} from '@cute-widgets/base/button';

@Component({
  selector: 'app-badge',
  imports: [
    CuteVStack,
    CuteBadge,
    CuteButton
  ],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class BadgePage {

}
