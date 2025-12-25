import { Component } from '@angular/core';
import {AppFooter} from '../../shared/app-footer/app-footer';
import {RouterModule} from '@angular/router';
import {CuteButtonModule} from '@cute-widgets/base/button';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterModule,
    CuteButtonModule,
    AppFooter
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundPage {

}
