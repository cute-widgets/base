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
import {Dialog} from '@angular/cdk/dialog';
import {createBlockScrollStrategy, createGlobalPositionStrategy} from '@angular/cdk/overlay';
import {ComponentType} from '@angular/cdk/portal';
import {Injectable, TemplateRef, InjectionToken, OnDestroy, inject, Injector} from '@angular/core';
import {CUTE_BOTTOM_SHEET_DATA, CuteBottomSheetConfig} from './bottom-sheet.config';
import {CuteBottomSheetContainer} from './bottom-sheet.container';
import {CuteBottomSheetRef} from './bottom-sheet.ref';
import {_animationsDisabled} from '@cute-widgets/base/core';

/** Injection token that can be used to specify default bottom sheet options. */
export const CUTE_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken<CuteBottomSheetConfig>(
  'cute-bottom-sheet-default-options',
);

/**
 * Service to trigger Material Design bottom sheets.
 */
@Injectable({providedIn: 'root'})
export class CuteBottomSheet implements OnDestroy {
  private _injector = inject(Injector);
  private _parentBottomSheet = inject(CuteBottomSheet, {optional: true, skipSelf: true});
  private _animationsDisabled = _animationsDisabled();
  private _defaultOptions = inject<CuteBottomSheetConfig>(CUTE_BOTTOM_SHEET_DEFAULT_OPTIONS, {
    optional: true,
  });

  private _bottomSheetRefAtThisLevel: CuteBottomSheetRef<any> | null = null;
  private _dialog = inject(Dialog);

  /** Reference to the currently opened bottom sheet. */
  get _openedBottomSheetRef(): CuteBottomSheetRef<any> | null {
    const parent = this._parentBottomSheet;
    return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
  }

  set _openedBottomSheetRef(value: CuteBottomSheetRef<any> | null) {
    if (this._parentBottomSheet) {
      this._parentBottomSheet._openedBottomSheetRef = value;
    } else {
      this._bottomSheetRefAtThisLevel = value;
    }
  }

  constructor(...args: unknown[]);
  constructor() {}

  /**
   * Opens a bottom sheet containing the given component.
   * @param component Type of the component to load into the bottom sheet.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened bottom sheet.
   */
  open<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: CuteBottomSheetConfig<D>,
  ): CuteBottomSheetRef<T, R>;

  /**
   * Opens a bottom sheet containing the given template.
   * @param template TemplateRef to instantiate as the bottom sheet content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened bottom sheet.
   */
  open<T, D = any, R = any>(
    template: TemplateRef<T>,
    config?: CuteBottomSheetConfig<D>,
  ): CuteBottomSheetRef<T, R>;

  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: CuteBottomSheetConfig<D>,
  ): CuteBottomSheetRef<T, R> {
    const _config = {...(this._defaultOptions || new CuteBottomSheetConfig()), ...config};
    let ref: CuteBottomSheetRef<T, R>;

    this._dialog.open<R, D, T>(componentOrTemplateRef, {
      ..._config,
      // Disable closing since we need to sync it up to the animation ourselves.
      disableClose: true,
      // Disable closing on detachments so that we can sync up the animation.
      closeOnOverlayDetachments: false,
      maxWidth: '100%',
      container: CuteBottomSheetContainer,
      scrollStrategy: _config.scrollStrategy || createBlockScrollStrategy(this._injector),
      positionStrategy: createGlobalPositionStrategy(this._injector)
        .centerHorizontally()
        .bottom('0'),
      disableAnimations: this._animationsDisabled,
      templateContext: () => ({bottomSheetRef: ref}),
      providers: (cdkRef, _cdkConfig, container) => {
        ref = new CuteBottomSheetRef(cdkRef, _config, container as CuteBottomSheetContainer);
        return [
          {provide: CuteBottomSheetRef, useValue: ref},
          {provide: CUTE_BOTTOM_SHEET_DATA, useValue: _config.data},
        ];
      },
    });

    // When the bottom sheet is dismissed, clear the reference to it.
    ref!.afterDismissed().subscribe(() => {
      // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
      if (this._openedBottomSheetRef === ref) {
        this._openedBottomSheetRef = null;
      }
    });

    if (this._openedBottomSheetRef) {
      // If a bottom sheet is already in view, dismiss it and enter the
      // new bottom sheet after exit animation is complete.
      this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance?.enter());
      this._openedBottomSheetRef.dismiss();
    } else {
      // If no bottom sheet is in view, enter the new bottom sheet.
      ref!.containerInstance.enter();
    }

    this._openedBottomSheetRef = ref!;
    return ref!;
  }

  /**
   * Dismisses the currently-visible bottom sheet.
   * @param result Data to pass to the bottom sheet instance.
   */
  dismiss<R = any>(result?: R): void {
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.dismiss(result);
    }
  }

  ngOnDestroy() {
    if (this._bottomSheetRefAtThisLevel) {
      this._bottomSheetRefAtThisLevel.dismiss();
    }
  }
}
