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
 * Injection token that can be used to reference instances of `CuteSuffix`. It serves as
 * an alternative token to the actual `CuteSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_SUFFIX = new InjectionToken<CuteSuffix>('CuteSuffix');

/** Suffix to be placed at the end of the form field. */
@Directive({
    selector: '[cuteSuffix], [cuteIconSuffix], [cuteTextSuffix]',
    providers: [{provide: CUTE_SUFFIX, useExisting: CuteSuffix}],
    host: {
        'class': 'input-group-text'
    },
})
export class CuteSuffix {
    @Input('cuteTextSuffix')
    set _isTextSelector(value: '') {
        this._isText = true;
    }
    _isText: boolean = false;
}
