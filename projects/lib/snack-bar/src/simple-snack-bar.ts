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
import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteSnackBarRef} from './snack-bar-ref';
import {CUTE_SNACK_BAR_DATA, CuteSnackBarConfig} from './snack-bar-config';
import {CuteSnackBarAction, CuteSnackBarActions, CuteSnackBarBody, CuteSnackBarLabel} from './snack-bar-content';
import {CuteLayoutControl} from "@cute-widgets/base/abstract";

let uniqueID = 0;

/**
 * Interface for a simple snack bar component that has a message and a single action.
 */
export interface TextOnlySnackBar {
  data: {message: string; action: string};
  snackBarRef: CuteSnackBarRef<TextOnlySnackBar>;
  action: () => void;
  hasAction: boolean;
}

@Component({
  selector: 'simple-snack-bar',
  templateUrl: './simple-snack-bar.html',
  styleUrls: ['./simple-snack-bar.scss'],
  exportAs: 'cuteSnackBar',
  host: {
    'class': 'cute-simple-snack-bar',
    '[attr.id]': 'id || null',
  },
  imports: [CuteButton, CuteSnackBarLabel, CuteSnackBarActions, CuteSnackBarAction, CuteSnackBarBody],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSnackBar extends CuteLayoutControl implements TextOnlySnackBar {
  snackBarRef = inject<CuteSnackBarRef<SimpleSnackBar>>(CuteSnackBarRef);
  data = inject(CUTE_SNACK_BAR_DATA);

  protected readonly config: CuteSnackBarConfig;

  constructor(...args: unknown[]);
  constructor() {
    super();
    this.config = this.snackBarRef.containerInstance.snackBarConfig;
  }

  protected override generateId(): string {
    return `cute-simple-snack-bar-${uniqueID++}`;
  }

  /** Performs the action on the snack bar. */
  action(): void {
    this.snackBarRef.dismissWithAction();
  }

  /** If the action button should be shown. */
  get hasAction(): boolean {
    return !!this.data.action;
  }
}
