import {Component, ElementRef, ViewChild} from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInputModule} from '@cute-widgets/base/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CuteAutocompleteModule} from '@cute-widgets/base/autocomplete';
import {CuteOption} from '@cute-widgets/base/core/option';
import {Observable, of} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {map, startWith} from 'rxjs/operators';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {AbstractPage} from '../abstract/abstract-page';
import {ComponentViewer} from "../../component-viewer/component-viewer";

@Component({
  selector: 'app-autocomplete',
    imports: [
        CuteFormFieldModule,
        CuteInputModule,
        CuteAutocompleteModule,
        CuteOption,
        ReactiveFormsModule,
        AsyncPipe,
        CuteVStack,
        CuteCheckbox,
        FormsModule,
        ComponentViewer
    ],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss',
})
export class AutocompletePage extends AbstractPage {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  protected myControl = new FormControl('');
  protected options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];
  protected filteredOptions: Observable<string[]> | undefined;

  protected requiredSelection = false;

  constructor() {
    super();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || '')),
    );
  }

  protected filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  protected filterInput(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = of(this.options.filter(option => option.toLowerCase().includes(filterValue)));
  }

  protected requiredSelectionChanged() {
    this.myControl.setValue("");
  }

}
