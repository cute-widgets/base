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
import {Directive} from "@angular/core";
import {CuteCollapseTrigger} from "@cute-widgets/base/collapse";

@Directive({
    selector: '[cuteNavbarToggler], [cute-navbar-toggler]',
    exportAs: 'cuteNavbarToggler',
    host: {
        'class': 'navbar-toggler border-secondary-subtle',
        'type': 'button',
    },
    hostDirectives: [
      {
        directive: CuteCollapseTrigger,
        inputs: ['cuteCollapseTriggerFor:cuteNavbarTogglerFor'],
        outputs: [],
      }
    ],
    standalone: true,
})
export class CuteNavbarToggler {}
