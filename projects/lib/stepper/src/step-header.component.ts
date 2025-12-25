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
import {FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewEncapsulation,
  TemplateRef,
  AfterViewInit, inject, booleanAttribute,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {CuteStepLabel} from './step-label.directive';
import {CuteStepperIntl} from './stepper-intl.service';
import {CuteStepperIconContext} from './stepper-icon.directive';
import {CdkStepHeader, StepState} from '@angular/cdk/stepper';
import {CuteIcon} from '@cute-widgets/base/icon';
import {NgTemplateOutlet} from '@angular/common';
import {ThemeColor} from "@cute-widgets/base/core";

@Component({
    selector: 'cute-step-header',
    templateUrl: './step-header.component.html',
    styleUrl: './step-header.component.scss',
    host: {
      'class': 'cute-step-header',
      '[class.cute-step-header-empty-label]': '_hasEmptyLabel()',
      '[class]': '"cute-" + (color || "primary")',
      'role': 'tab', // ignore cdk role in favor of setting appropriately in html
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, CuteIcon]
})
export class CuteStepHeader extends CdkStepHeader implements AfterViewInit, OnDestroy {
  _intl = inject(CuteStepperIntl);
  private _focusMonitor = inject(FocusMonitor);

  private _intlSubscription: Subscription;

  /** State of the given step. */
  @Input() state!: StepState;

  /** Label of the given step. */
  @Input() label: CuteStepLabel | string | null = null;

  /** Error message to display when there's an error. */
  @Input() errorMessage: string | undefined;

  /** Overrides for the header icons, passed in via the stepper. */
  @Input() iconOverrides: {[key: string]: TemplateRef<CuteStepperIconContext>} | undefined;

  /** Index of the given step. */
  @Input() index: number = -1;

  /** Whether the given step is selected. */
  @Input({transform: booleanAttribute}) selected: boolean = false;

  /** Whether the given step label is active. */
  @Input({transform: booleanAttribute}) active: boolean = false;

  /** Whether the given step is optional. */
  @Input({transform: booleanAttribute}) optional: boolean = false;

  /** Whether the ripple should be disabled. */
  @Input({transform: booleanAttribute}) disableRipple: boolean = false;

  /** Theme palette color of the step header. */
  @Input() color: ThemeColor | undefined;

  constructor(...args: unknown[]);
  constructor() {
    super();
    const changeDetectorRef = inject(ChangeDetectorRef);
    this._intlSubscription = this._intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    this._intlSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  override focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  /** Returns string label of given step if it is a text label. */
  _stringLabel(): string | null {
    return this.label instanceof CuteStepLabel ? null : this.label;
  }

  /** Returns CuteStepLabel if the label of given step is a template label. */
  _templateLabel(): CuteStepLabel | null {
    return this.label instanceof CuteStepLabel ? this.label : null;
  }

  /** Returns the host HTML element. */
  _getHostElement() {
    return this._elementRef.nativeElement;
  }

  /** Template context variables that are exposed to the `cuteStepperIcon` instances. */
  _getIconContext(): CuteStepperIconContext {
    return {
      index: this.index,
      active: this.active,
      optional: this.optional,
    };
  }

  _getDefaultTextForState(state: StepState): string {
    if (state == 'number') {
      return `${this.index + 1}`;
    }
    if (state == 'done') {
      return 'bi-check-lg';
    }
    if (state == 'edit') {
      return 'bi-pencil-fill';
    }
    if (state == 'error') {
      return 'bi-exclamation-triangle-fill';
    }
    return state;
  }

  protected _hasEmptyLabel() {
    return (
      !this._stringLabel() &&
      !this._templateLabel() &&
      !this._hasOptionalLabel() &&
      !this._hasErrorLabel()
    );
  }

  protected _hasOptionalLabel() {
    return this.optional && this.state !== 'error';
  }

  protected _hasErrorLabel() {
    return this.state === 'error';
  }
}
