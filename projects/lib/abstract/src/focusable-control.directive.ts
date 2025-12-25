/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, EventEmitter, inject, Input, numberAttribute, Output} from '@angular/core';
import {FocusableOption, FocusMonitor, FocusOrigin, ListKeyManagerOption} from "@angular/cdk/a11y";
import {CuteBaseControl} from './base-control.directive';
import {RippleManager} from "@cute-widgets/base/core/ripple";

function transformTabIndex(value: unknown): number | undefined {
  return value == null ? undefined : numberAttribute(value);
}

@Directive()
export abstract class CuteFocusableControl extends CuteBaseControl
                            implements FocusableOption, ListKeyManagerOption
{
  // If necessary, the `monitor` method should be called from descendant classes in one of the
  // directive/component's life circle methods
  protected readonly _focusMonitor: FocusMonitor = inject(FocusMonitor);

  /**
   * Allows making HTML elements un/focusable (usually with the Tab key, hence the name) and
   * determines their relative ordering for sequential focus navigation.
   */
  @Input({transform: transformTabIndex})
  get tabIndex(): number | undefined { return this._tabIndex; }
  set tabIndex(value: number | undefined) {
    if (value !== this._tabIndex) {
      this._tabIndex = value;
      if (this.isInitialized) {
        this.tabIndexChange.emit();
      }
    }
  }
  private _tabIndex: number | undefined;

  @Output() tabIndexChange = new EventEmitter<void>();

  protected constructor() {
    super();
    const tabInd = this.getAttribute("tabindex");
    if (tabInd) {
      this.tabIndex = numberAttribute(tabInd, 0);
    }
  }

  /** Set focus on this component */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
    } else if (options && !Array.isArray(options)) {
      this._nativeElement.focus(options);
    } else {
      this._nativeElement.focus();
    }
  }

  /** Gets the current label of the component. Part of `ListKeyManagerOption` interface. */
  getLabel(): string {
    return (this._nativeElement.textContent||"").trim();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._focusMonitor.stopMonitoring(this._elementRef);
    RippleManager.removeRipple(this._nativeElement);
  }

}
