import {Component, signal} from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {AbstractControl, FormControl, FormsModule, NgModel, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabelType} from '@cute-widgets/base/form-field';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {CuteRadioModule} from '@cute-widgets/base/radio';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import {CuteCardModule} from '@cute-widgets/base/card';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-form-field',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CuteVStack,
        CuteFormFieldModule,
        CuteButtonModule,
        CuteInputModule,
        CuteIconModule,
        CuteSelectModule,
        CuteRadioModule,
        CuteCardModule,
        CuteCheckbox,
        CuteHStack,
        CuteTooltip,
        ComponentViewer,
    ],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormFieldPage extends AbstractPage {
  protected floatLabel: FloatLabelType = "always";
  protected clearMeValue = ""; //"ClearMe";
  protected email = new FormControl('', [Validators.required, Validators.email]);

  protected hide = signal(true);
  protected errorMessage = signal("");

  constructor() {
    super();
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isRequired(control: AbstractControl): boolean {
    return control.hasValidator(Validators.required);
  }

  getErrorText(model: NgModel): string {
    let text: string = "";
    if (model.invalid && model.errors) {
      if (model.errors["required"]) {
        text = "Input is required.";
      } else if (model.errors["minlength"]) {
        text = "Minimum number of chars: " + model.errors["minlength"].requiredLength;
      } else if (model.errors["maxlength"]) {
        text = "Maximum number of chars: " + model.errors["maxlength"].requiredLength;
      }
    }
    return text;
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

}
