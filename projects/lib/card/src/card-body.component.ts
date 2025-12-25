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
import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {ThemeColor} from "@cute-widgets/base/core";

/**
 * Content of a card, intended for use within `<cute-card>`. This component is an optional
 * convenience for use with other convenience elements, such as `<cute-card-title>`; any custom
 * content block element may be used in its place.
 *
 * CuteCardContent provides no behaviors, instead serving as a purely visual treatment.
 */
@Component({
  selector: 'cute-card-body, cute-card-content',
  templateUrl: './card-body.component.html',
  styleUrls: ['./card-body.component.scss'],
  exportAs: 'cuteCardBody',
  host: {
    'class': 'cute-card-body card-body',
    '[class]': 'color ? "text-"+color : ""',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteCardBody {
  /** Card body text color */
  @Input() color: ThemeColor | undefined;
}
