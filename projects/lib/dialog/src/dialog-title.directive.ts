/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input} from "@angular/core";

@Directive({
  selector: '[cute-dialog-title], [cuteDialogTitle]',
  exportAs: 'cuteDialogTitle',
  host: {
    'class': 'cute-dialog-title modal-title user-select-none',
    '[id]': 'id || null',
    '[style.pointer-events]': '"none"',
  },
  standalone: true,
})
export class CuteDialogTitle {
  @Input() id: unknown;
}
