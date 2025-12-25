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
 * Subcomponent for company, product, or project name
 */
@Directive({
    selector: '[cuteNavbarBrand], [cute-navbar-brand]',
    exportAs: 'cuteNavbarBrand',
    host: {
        'class': 'cute-navbar-brand navbar-brand'
    },
    standalone: true,
})
export class CuteNavbarBrand {}
