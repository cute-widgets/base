/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild,
  inject,
  Input, OnDestroy,
  ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import {CdkStep} from "@angular/cdk/stepper";
import {ErrorStateMatcher} from "@cute-widgets/base/core/error";
import {CdkPortalOutlet, TemplatePortal} from "@angular/cdk/portal";
import {Subscription} from "rxjs";
import {CuteStepLabel} from "./step-label.directive";
import {ThemeColor} from "@cute-widgets/base/core";
import {CuteStepContent} from "./step-content.directive";
import {map, startWith, switchMap} from "rxjs/operators";
import {AbstractControl, FormGroupDirective, NgForm} from "@angular/forms";

@Component({
    selector: 'cute-step',
    templateUrl: './step.component.html',
    styleUrls: ['./step.component.scss'],
    providers: [
        { provide: ErrorStateMatcher, useExisting: CuteStep },
        { provide: CdkStep, useExisting: CuteStep },
    ],
    exportAs: 'cuteStep',
    host: {
        'class': 'cute-step',
        'hidden': '', // Hide the steps, so they don't affect the layout.
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkPortalOutlet]
})
export class CuteStep extends CdkStep implements ErrorStateMatcher, AfterContentInit, OnDestroy {
  private _errorStateMatcher = inject(ErrorStateMatcher, {skipSelf: true});
  private _viewContainerRef = inject(ViewContainerRef);
  private _isSelected = Subscription.EMPTY;

  /** Content for step label given by `<ng-template cuteStepLabel>`. */
    // We need an initializer here to avoid a TS error.
  @ContentChild(CuteStepLabel) override stepLabel: CuteStepLabel = undefined!;

  /** Theme color for the particular step. */
  @Input() color: ThemeColor | undefined;

  @Input() description: string | undefined;

  /** Content that will be rendered lazily. */
  @ContentChild(CuteStepContent, {static: false}) _lazyContent: CuteStepContent | undefined;

  /** Currently attached portal containing the lazy content. */
  _portal: TemplatePortal | undefined;

  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes
      .pipe(
        switchMap(() => {
          return this._stepper.selectionChange.pipe(
            map(event => event.selectedStep === this),
            startWith(this._stepper.selected === this),
          );
        }),
      )
      .subscribe(isSelected => {
        if (isSelected && this._lazyContent && !this._portal) {
          this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef!);
        }
      });
  }

  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }

  /** Custom error state matcher that additionally checks for the validity of interacted form. */
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const originalErrorState = this._errorStateMatcher.isErrorState(control, form);

    // Custom error state checks for the validity of form that is not submitted or touched
    // since a user can trigger a form change by calling for another step without directly
    // interacting with the current form.
    const customErrorState = !!(control && control.invalid && this.interacted);

    return originalErrorState || customErrorState;
  }
}
