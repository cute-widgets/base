import { Component } from '@angular/core';
import {CuteContainer, CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteIcon} from '@cute-widgets/base/icon';
import {CuteSvgSymbol} from '@cute-widgets/base/core/directives';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {RouterLink} from '@angular/router';
import {AppFooter} from '../../shared/app-footer/app-footer';

@Component({
  selector: 'app-home',
  imports: [
    CuteHStack,
    CuteContainer,
    CuteIcon,
    // CuteSvgSymbol,
    CuteButton,
    CuteVStack,
    //CuteTooltip,
    RouterLink,
    //AppFooter
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

}
