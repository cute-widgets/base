/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, InjectionToken, Input} from '@angular/core';

/**
 * Injection token that can be used to reference instances of `CutePrefix`. It serves as
 * an alternative token to the actual `CutePrefix` class, which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_PREFIX = new InjectionToken<CutePrefix>('CutePrefix');

/** Prefix to be placed in front of the form field. */
@Directive({
    selector: '[cutePrefix], [cuteIconPrefix], [cuteTextPrefix]',
    providers: [{provide: CUTE_PREFIX, useExisting: CutePrefix}],
    host: {
      'class': 'input-group-text'
    },
})
export class CutePrefix {
    @Input('cuteTextPrefix')
    set _isTextSelector(value: '') {
        this._isText = true;
    }
    _isText: boolean = false;
}
