/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from "@angular/core";

/**
 *  This directive adjusts vertical alignment and horizontal spacing for strings of text.
 */
@Directive({
  selector: 'cute-navbar-text, [cuteNavbarText], [cute-navbar-text]',
  exportAs: 'cuteNavbarText',
  host: {
    'class': 'navbar-text'
  },
  standalone: true,
})
export class CuteNavbarText {}
