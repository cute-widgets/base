import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {CuteChipInputEvent, CuteChipsModule} from "@cute-widgets/base/chips";
import {CuteAutocompleteModule, CuteAutocompleteSelectedEvent} from "@cute-widgets/base/autocomplete";
import {CuteFormFieldModule} from "@cute-widgets/base/form-field";
import {CuteIconModule} from "@cute-widgets/base/icon";
import {AsyncPipe} from "@angular/common";
import {CuteOption} from "@cute-widgets/base/core/option";

@Component({
    selector: 'chips-autocomplete',
    imports: [
        FormsModule,
        CuteFormFieldModule,
        CuteChipsModule,
        CuteIconModule,
        CuteAutocompleteModule,
        AsyncPipe,
        CuteOption,
        ReactiveFormsModule
    ],
    templateUrl: './chips-autocomplete.component.html',
    styleUrl: './chips-autocomplete.component.scss'
})
export class ChipsAutocompleteComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  add(event: CuteChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: CuteAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
