import { Component } from '@angular/core';
import {TabsExampleComponent} from './tabs-example/tabs-example.component';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-tabs',
    imports: [
        TabsExampleComponent,
        ComponentViewer
    ],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class TabsPage extends AbstractPage {}
