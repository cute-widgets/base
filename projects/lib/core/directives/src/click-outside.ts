/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, ElementRef, Output, EventEmitter, HostListener, inject} from '@angular/core';

/**
 * Tracks a click outside the target element.
 * @example
 * <div (cuteClickOutside)="closeDropdown()">
 *   <button (click)="toggleDropdown()">Toggle Dropdown</button>
 *   <div *ngIf="dropdownOpen" class="dropdown">
 *     Dropdown content
 *   </div>
 * </div>
 */
@Directive({
  selector: '[cuteClickOutside]'
})
export class CuteClickOutside {
  private _elementRef = inject(ElementRef);

  /** Emitted when the user clicks on a document outside the parent element. */
  @Output() cuteClickOutside = new EventEmitter<MouseEvent>();

  constructor() {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.cuteClickOutside.emit(event);
    }
  }
}
