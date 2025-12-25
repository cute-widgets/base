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
import {Directive, Input} from "@angular/core";
import {HorizontalEdge} from "@cute-widgets/base/core/types";

@Directive({
  selector: `cute-dialog-footer, [cute-dialog-footer], [cuteDialogFooter],
             cute-dialog-actions, [cute-dialog-actions], [cuteDialogActions]
  `,
  exportAs: 'cuteDialogFooter, cuteDialogActions',
  host: {
    'class': 'cute-dialog-footer cute-dialog-actions modal-footer',
    '[style.justify-content]': 'align',
  },
  standalone: true,
})
export class CuteDialogFooter {

  /** Horizontal alignment of the footer's content */
  @Input() align: HorizontalEdge | 'center' = 'start';

}
