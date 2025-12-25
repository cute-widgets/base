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
import {Directive, inject, Input} from '@angular/core';
import {_IdGenerator} from '@angular/cdk/a11y';

/** Hint text to be shown underneath the form field control. */
@Directive({
    selector: 'cute-hint',
    exportAs: 'cuteHint',
    host: {
        'class': 'form-text cute-form-field-hint cute-form-field-bottom-align',
        '[class.cute-form-field-hint-end]': 'align === "end"',
        '[id]': 'id',
        // Remove align attribute to prevent it from interfering with layout.
        '[attr.align]': 'null',
    },
})
export class CuteHint {
    /** Whether to align the hint label at the start or end of the line. */
    @Input() align: 'start' | 'end' = 'start';

    /** Unique ID for the hint. Used for the `aria-describedby` on the form field control. */
    @Input() id: string = inject(_IdGenerator).getId('cute-hint-');
}
