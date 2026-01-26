import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteGridListModule} from '@cute-widgets/base/grid-list';
import {ComponentHeader} from '../../../shared/utils/component-header';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-grid-list',
  imports: [
    CuteVStack,
    CuteGridListModule,
    ComponentHeader
  ],
  templateUrl: './grid-list.html',
  styleUrl: './grid-list.scss',
})
export class GridListPage {
  tiles: Tile[] = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

}
