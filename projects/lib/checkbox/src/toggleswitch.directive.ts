/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, inject} from '@angular/core';
import {CuteCheckbox} from './checkbox.component';

/**
 * A switch has the markup of a custom checkbox but uses the .form-switch class to render a toggle switch.
 */
@Directive({
  selector: 'cute-checkbox[cuteToggleSwitch]',
  exportAs: 'cuteToggleSwitch',
  standalone: true,
})
export class CuteToggleSwitch {
  private _checkBox = inject(CuteCheckbox);

  constructor() {
    this._checkBox.role = "switch"
  }
}
