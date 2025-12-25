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
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  ViewEncapsulation,
  QueryList,
} from '@angular/core';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {CuteDrawer, CuteDrawerContainer, CuteDrawerContent, CUTE_DRAWER_CONTAINER} from './drawer';

@Component({
  selector: 'cute-sidenav-content',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'cute-drawer-content cute-sidenav-content',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CdkScrollable,
      useExisting: CuteSidenavContent,
    },
  ],
  standalone: true,
})
export class CuteSidenavContent extends CuteDrawerContent {}

@Component({
  selector: 'cute-sidenav',
  exportAs: 'cuteSidenav',
  templateUrl: './drawer.html',
  host: {
    'class': 'cute-drawer cute-sidenav',
    // The sidenav container should not be focused on when used in side mode. See b/286459024 for
    // reference. Updates tabIndex of drawer/container to default to null if in side mode.
    '[attr.tabIndex]': '(mode !== "side") ? "-1" : null',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.cute-drawer-end]': 'position === "end"',
    '[class.cute-drawer-over]': 'mode === "over"',
    '[class.cute-drawer-push]': 'mode === "push"',
    '[class.cute-drawer-side]': 'mode === "side"',
    '[class.cute-sidenav-fixed]': 'fixedInViewport',
    '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
  },
  imports: [CdkScrollable],
  providers: [{provide: CuteDrawer, useExisting: CuteSidenav}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class CuteSidenav extends CuteDrawer {
  /** Whether the sidenav is fixed in the viewport. */
  @Input()
  get fixedInViewport(): boolean { return this._fixedInViewport; }
  set fixedInViewport(value: BooleanInput) {
    this._fixedInViewport = coerceBooleanProperty(value);
  }
  private _fixedInViewport = false;

  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  @Input()
  get fixedTopGap(): number { return this._fixedTopGap; }
  set fixedTopGap(value: NumberInput) {
    this._fixedTopGap = coerceNumberProperty(value);
  }
  private _fixedTopGap = 0;

  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  @Input()
  get fixedBottomGap(): number { return this._fixedBottomGap; }
  set fixedBottomGap(value: NumberInput) {
    this._fixedBottomGap = coerceNumberProperty(value);
  }
  private _fixedBottomGap = 0;
}

@Component({
  selector: 'cute-sidenav-container',
  exportAs: 'cuteSidenavContainer',
  templateUrl: './sidenav-container.html',
  styleUrls: ['./drawer.scss'],
  host: {
    'class': 'cute-drawer-container cute-sidenav-container',
    '[class.cute-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CUTE_DRAWER_CONTAINER,
      useExisting: CuteSidenavContainer,
    },
    {
      provide: CuteDrawerContainer,
      useExisting: CuteSidenavContainer,
    },
  ],
  imports: [
    CuteSidenavContent
  ]
})
export class CuteSidenavContainer extends CuteDrawerContainer {
  @ContentChildren(CuteSidenav, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  // We need an initializer here to avoid a TS error.
  override _allDrawers: QueryList<CuteSidenav> = undefined!;

  // We need an initializer here to avoid a TS error.
  @ContentChild(CuteSidenavContent) override _content: CuteSidenavContent = undefined!;
}
