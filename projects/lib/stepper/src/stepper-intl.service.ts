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
import {Injectable, Optional, SkipSelf} from '@angular/core';
import {Subject} from 'rxjs';

/** Stepper data that is required for internationalization. */
@Injectable({providedIn: 'root'})
export class CuteStepperIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** Label that is rendered below optional steps. */
  optionalLabel: string = 'Optional';

  /** Label that is used to indicate a step as completed to screen readers. */
  completedLabel: string = 'Completed';

  /** Label that is used to indicate a step as editable to screen readers. */
  editableLabel: string = 'Editable';
}
