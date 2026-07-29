/**
 * @license Apache-2.0
 *
 * Copyright (c) 2026 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, ElementRef, Output, EventEmitter, HostListener, inject} from '@angular/core';

/**
 * Tracks a click inside the target element.
 * @example
 * <div (cuteClickInside)="logDropdownState()">
 *   <button (click)="toggleDropdown()">Toggle Dropdown</button>
 *   <div *ngIf="dropdownOpen" class="dropdown">
 *     Dropdown content
 *   </div>
 * </div>
 */
@Directive({
  selector: '[cuteClickInside]'
})
export class CuteClickInside {
  private _elementRef = inject(ElementRef);

  /** Emitted when the user clicks on a document inside the parent element. */
  @Output() cuteClickInside = new EventEmitter<MouseEvent>();

  constructor() {}

  @HostListener('window:click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this._elementRef.nativeElement.contains(event.target)) {
      this.cuteClickInside.emit(event);
    }
  }
}
