import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteChipsModule} from '@cute-widgets/base/chips';
import {ThemeColor} from '@cute-widgets/base/core';
import {ChipsFromControlComponent} from './examples/chips-from-control.component';
import {ChipsAutocompleteComponent} from './examples/chips-autocomplete/chips-autocomplete.component';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from '../../component-viewer/component-viewer';

export interface ChipColor {
  name: string;
  color: ThemeColor | undefined;
}

@Component({
  selector: 'app-chips',
  imports: [
    CuteVStack,
    CuteChipsModule,
    ChipsFromControlComponent,
    ChipsAutocompleteComponent,
    ComponentViewer,
  ],
  templateUrl: './chips.html',
  styleUrl: './chips.scss',
})
export class ChipsPage extends AbstractPage {

  // Chips
  availableColors: ChipColor[] = [
    {name: 'none', color: undefined},
    {name: 'Primary', color: 'primary'},
    {name: 'Success', color: 'success'},
    {name: 'Warning', color: 'warning'},
  ];

}
