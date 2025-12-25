/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import { Directive, HostListener } from '@angular/core';

/**
 * Allows users to disable the context menu that appears when they right-click
 */
@Directive({
  selector: '[cuteDisableContextMenu]',
  standalone: true,
})
export class CuteDisableContextMenu {
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
  }
}
