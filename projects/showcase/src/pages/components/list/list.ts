import { Component } from '@angular/core';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CuteDivider} from '@cute-widgets/base/divider';
import {CuteIcon} from '@cute-widgets/base/icon';
import {DatePipe} from '@angular/common';

interface Shoes {
  value: string;
  name: string;
}

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-list',
  imports: [
    ReactiveFormsModule,
    CuteListModule,
    CuteVStack,
    CuteHStack,
    CuteDivider,
    CuteIcon,
    DatePipe,
    //CuteButton
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class ListPage {

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  form: FormGroup;
  shoes: Shoes[] = [
    {value: 'boots', name: 'Boots'},
    {value: 'clogs', name: 'Clogs'},
    {value: 'loafers', name: 'Loafers'},
    {value: 'moccasins', name: 'Moccasins'},
    {value: 'sneakers', name: 'Sneakers'},
  ];
  shoesControl = new FormControl();

  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];


  constructor() {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }

  openSnackBar() {
    alert("Snack Bar opened.");
  }


  openPizzaSnackBar() {
    alert("Pizza Snack Bar opened.");
  }

}
