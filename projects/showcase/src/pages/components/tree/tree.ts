import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteTreeModule} from '@cute-widgets/base/tree';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {TreeDynamicExample} from './dynamic/tree-dynamic-example';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];


@Component({
  selector: 'app-tree',
  imports: [
    CuteHStack,
    CuteTreeModule,
    CuteButtonModule,
    CuteIconModule,
    CuteVStack,
    TreeDynamicExample,
  ],
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
})
export class TreePage {
  dataSource = TREE_DATA;
  childrenAccessor = (node: FoodNode) => node.children ?? [];
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
