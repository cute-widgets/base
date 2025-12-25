/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from '@angular/core';

@Directive({
  selector: '[cuteFocusInitial]',
  standalone: true,
  host: {
    '[attr.cdkFocusInitial]': 'true',
  }
})
export class CuteFocusInitial {}
