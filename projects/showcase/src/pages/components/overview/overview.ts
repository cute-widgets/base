import { Component } from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-overview',
  imports: [
    MarkdownComponent
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class OverviewPage {

}
