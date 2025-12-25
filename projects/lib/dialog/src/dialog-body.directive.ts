/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from "@angular/core";

@Directive({
  selector: `cute-dialog-body, [cute-dialog-body], [cuteDialogBody],
             cute-dialog-content, [cute-dialog-content], [cuteDialogContent]
  `,
  exportAs: 'cuteDialogBody',
  host: {
    'class': 'cute-dialog-body modal-body'
  },
  standalone: true,
})
export class CuteDialogBody {

}
