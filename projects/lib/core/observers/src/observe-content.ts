/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {Directive} from "@angular/core";
import {CdkObserveContent} from "@angular/cdk/observers";

/**
 * Directive that triggers a callback whenever the content of
 * its associated element has changed.
 */
@Directive({
  selector: '[cuteObserveContent]',
  exportAs: 'cuteObserveContent',
  hostDirectives: [
    {directive: CdkObserveContent,
      inputs: [
        "cdkObserveContentDisabled: cuteObserveContentDisabled",
        "debounce: cuteObserveContentDebounce"
      ],
      outputs: [
        "cdkObserveContent: cuteObserveContent"
      ]
    },
  ],
  standalone: true,
})
export class CuteObserveContent {}
