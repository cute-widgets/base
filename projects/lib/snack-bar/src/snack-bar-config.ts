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
import {ViewContainerRef, InjectionToken} from '@angular/core';
import {AriaLivePoliteness} from '@angular/cdk/a11y';
import {Direction} from '@angular/cdk/bidi';
import {RichThemeColor} from "@cute-widgets/base/core";

/** Injection token that can be used to access the data that was passed in to a snack bar. */
export const CUTE_SNACK_BAR_DATA = new InjectionToken<any>('CuteSnackBarData');

/** Possible values for horizontalPosition on CuteSnackBarConfig. */
export type CuteSnackBarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';

/** Possible values for verticalPosition on CuteSnackBarConfig. */
export type CuteSnackBarVerticalPosition = 'top' | 'bottom';

/**
 * Configuration used when opening a snack-bar.
 */
export class CuteSnackBarConfig<D = any> {
  /** The politeness level for the LiveAnnouncer announcement. */
  politeness?: AriaLivePoliteness = 'assertive';

  /**
   * Message to be announced by the LiveAnnouncer. When opening a snackbar without a custom
   * component or template, the announcement message will default to the specified message.
   */
  announcementMessage?: string = '';

  /**
   * The view container that serves as the parent for the snackbar for the purposes of dependency
   * injection. Note: this does not affect where the snackbar is inserted in the DOM.
   */
  viewContainerRef?: ViewContainerRef;

  /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
  duration?: number = 0;

  /** Extra CSS classes to be added to the snack bar container. */
  panelClass?: string | string[];

  /** Text layout direction for the snack bar. */
  direction?: Direction;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** The horizontal position to place the snack bar. */
  horizontalPosition?: CuteSnackBarHorizontalPosition = 'center';

  /** The vertical position to place the snack bar. */
  verticalPosition?: CuteSnackBarVerticalPosition = 'bottom';

  /** Theme color for the snack bar. */
  color?: RichThemeColor;

  /** Adds a linear gradient as background image to the backgrounds */
  gradientFill?: boolean;

  /** Whether the user can dismiss the snack bar by clicking close button. */
  dismissible?: boolean;

}
