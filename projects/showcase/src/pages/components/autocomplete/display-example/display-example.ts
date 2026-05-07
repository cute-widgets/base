import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {CuteAutocompleteModule} from '@cute-widgets/base/autocomplete';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteDivider} from '@cute-widgets/base/divider';

export interface User {
  name: string;
}

/**
 * @title Display value autocomplete
 */
@Component({
  selector: 'autocomplete-display-example',
  templateUrl: './display-example.html',
  styleUrl: './display-example.scss',
  imports: [
    FormsModule,
    CuteFormFieldModule,
    CuteInputModule,
    CuteAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    CuteDivider,
  ],
})
export class AutocompleteDisplayExample {
  myControl = new FormControl<string | User>('');
  options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'}];
  filteredOptions: Observable<User[]>;

  constructor() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
