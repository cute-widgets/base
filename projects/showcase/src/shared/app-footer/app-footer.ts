import { Component } from '@angular/core';
import {CuteNavbarModule} from '@cute-widgets/base/navbar';
import {CuteIcon} from '@cute-widgets/base/icon';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteNavModule} from '@cute-widgets/base/core/nav';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    RouterModule,
    CuteNavbarModule,
    CuteNavModule,
    CuteIcon,
    CuteButton,
  ],
  templateUrl: './app-footer.html',
  styleUrl: './app-footer.scss',
})
export class AppFooter {

}
