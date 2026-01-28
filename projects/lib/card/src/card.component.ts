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
import {
  ChangeDetectionStrategy,
  Component, contentChild,
  ContentChild,
  inject,
  Input,
  SecurityContext,
  ViewEncapsulation
} from "@angular/core";
import {CuteCardHeader} from "./card-header.directive";
import {CuteCardFooter} from "./card-footer.directive";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {DomSanitizer} from "@angular/platform-browser";

let nextId: number = -1;

/**
 * A flexible and extensible content container with multiple variants and options.
 */
@Component({
  selector: 'cute-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  exportAs: 'cuteCard',
  host: {
    'class': 'cute-card card',
    '[class.cute-card-with-background-image]': 'backgroundImage',
    '[attr.backgroundImage]': 'null',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteCard extends CuteLayoutControl {
  private _sanitizer = inject(DomSanitizer);

  @Input()
  get backgroundImage(): string | undefined {return this._backgroundImage;}
  set backgroundImage(value: string | undefined) {
    if (value) {
      this._backgroundImage = this._sanitizer.sanitize(SecurityContext.URL, value) ?? undefined;
      if (this._backgroundImage) {
        this._nativeElement.style.backgroundImage = `url('${this._backgroundImage.trim()}')`;
      }
    } else {
      this._nativeElement.style.backgroundImage = "none";
      this._backgroundImage = undefined;
    }
  }
  private _backgroundImage: string | undefined;

  /** `CuteCardHeader` element if it was defined in the `CuteCard` template. */
  readonly _header = contentChild(CuteCardHeader, {descendants: false});

  /** `CuteCardFooter` element if it was defined in the `CuteCard` template. */
  readonly _footer = contentChild(CuteCardFooter, {descendants: false});

  constructor() {
    super();
  }

  protected override generateId(): string {
    return `cute-card-${++nextId}`;
  }

}
