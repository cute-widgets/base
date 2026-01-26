import { Component } from '@angular/core';
import {TabsExampleComponent} from './tabs-example/tabs-example.component';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-tabs',
  imports: [
    TabsExampleComponent,
    ComponentHeader
  ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class TabsPage {

}
