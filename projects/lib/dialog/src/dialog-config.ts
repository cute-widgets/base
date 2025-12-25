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
import {ViewContainerRef, Injector} from '@angular/core';
import {Direction} from '@angular/cdk/bidi';
import {ScrollStrategy} from '@angular/cdk/overlay';
import {DragAxis} from "@angular/cdk/drag-drop";
import {LayoutBreakpoint} from "@cute-widgets/base/core/types";
import {DialogConfig} from "@angular/cdk/dialog";

/** Options for where to set focus to automatically on dialog open */
export type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';

/** Valid ARIA roles for a dialog element. */
export type DialogRole = 'dialog' | 'alertdialog';

/** Full-screen strategy for a dialog element */
export type DialogFullScreenStrategy = 'fullscreen'|`fullscreen-${LayoutBreakpoint}`;

/** Possible overrides for a dialog's position. */
export interface DialogPosition {
  /** Override for the dialog's top position. */
  top?: string;

  /** Override for the dialog's bottom position. */
  bottom?: string;

  /** Override for the dialog's left position. */
  left?: string;

  /** Override for the dialog's right position. */
  right?: string;
}

/**
 * Configuration for opening a modal dialog with the `CuteDialog` service.
 */
export class CuteDialogConfig<D = any> {
  /**
   * Where the attached component should live in an Angular *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /**
   * Injector used for the instantiation of the component to be attached. If provided,
   * take precedence over the injector indirectly provided by `ViewContainerRef`.
   */
  injector?: Injector;

  /** ID for the dialog. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the dialog element. */
  role?: DialogRole = 'dialog';

  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the dialog has a backdrop. */
  hasBackdrop?: boolean = true;

  /** Custom class for the backdrop. */
  backdropClass?: string | string[] = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose?: boolean = false;

  /** Function used to determine whether the dialog is allowed to close. */
  closePredicate?: <
    Result = unknown,
    Component = unknown,
    Config extends DialogConfig = CuteDialogConfig,
  >(
    result: Result | undefined,
    config: Config,
    componentInstance: Component | null,
  ) => boolean;

  /** Width of the dialog. */
  width?: string = '';

  /** Height of the dialog. */
  height?: string = '';

  /** Min-width of the dialog. If a number is provided, assumes pixel units. */
  minWidth?: number | string;

  /** Min-height of the dialog. If a number is provided, assumes pixel units. */
  minHeight?: number | string;

  /** Max-width of the dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
  maxWidth?: number | string = '80vw';

  /** Max-height of the dialog. If a number is provided, assumes pixel units. */
  maxHeight?: number | string = '95vh';

  /** Position overrides. */
  position?: DialogPosition;

  /** Full-screen strategy to be used for the dialog. */
  fullscreenStrategy?: DialogFullScreenStrategy;

  /** Whether the dialog can be dragged at runtime and optionally restrict dragging to a specific axis */
  draggable?: boolean | `${DragAxis}-axis` = false;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** Layout direction for the dialog's content. */
  direction?: Direction;

  /** ID of the element that describes the dialog. */
  ariaDescribedBy?: string | null = null;

  /** ID of the element that labels the dialog. */
  ariaLabelledBy?: string | null = null;

  /** Aria label to assign to the dialog element. */
  ariaLabel?: string | null = null;

  /** Whether this is a modal dialog. Used to set the `aria-modal` attribute. */
  ariaModal?: boolean = true;

  /**
   * Where the dialog should focus on open.
   */
  autoFocus?: AutoFocusTarget | string = 'first-tabbable';

  /**
   * Whether the dialog should restore focus to the
   * previously focused element, after it's closed.
   */
  restoreFocus?: boolean = true;

  /** Whether to wait for the opening animation to finish before trapping focus. */
  delayFocusTrap?: boolean = true;

  /** Scroll strategy to be used for the dialog. */
  scrollStrategy?: ScrollStrategy;

  /**
   * Whether the dialog should close when the user goes backwards/forwards in history.
   * Note that this usually doesn't include clicking on links (unless the user is using
   * the `HashLocationStrategy`).
   */
  closeOnNavigation?: boolean = true;

  /**
   * Duration of the entered animation in ms.
   */
  enterAnimationDuration?: number;

  /**
   * Duration of the exit animation in ms.
   */
  exitAnimationDuration?: number;
}
