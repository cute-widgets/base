import { Component } from '@angular/core';
import {AbstractPage} from '../abstract/abstract-page';
import {CuteNavbarModule} from '@cute-widgets/base/navbar';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteNavModule} from '@cute-widgets/base/core/nav';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInput} from '@cute-widgets/base/input';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ComponentViewer} from '../../component-viewer/component-viewer';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    FormsModule,
    CuteNavModule,
    CuteButtonModule,
    CuteIconModule,
    CuteNavbarModule,
    ComponentViewer,
    CuteFormFieldModule,
    CuteInput,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarPage extends AbstractPage {}
