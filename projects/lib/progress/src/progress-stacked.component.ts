/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from "@angular/core";
import {CuteBaseControl} from "@cute-widgets/base/abstract";

const DEFAULT_THICKNESS = "1.125rem";

@Component({
  selector: 'cute-progress-stacked',
  template: '<ng-content></ng-content>',
  styles: [`
    .progress-stacked {
      &.vertical-stack {
        flex-direction: column-reverse;
        width: 1rem;
        height: 100%;
      }

      .cute-progress-bar {
        .progress {
          overflow: visible;

          &> .progress-bar {
            width: 100%;
          }
        }
      }
    }
  `],
  exportAs: 'cuteProgressStacked',
  host: {
    'class': 'cute-progress-stacked progress-stacked',
    '[class.vertical-stack]': 'vertical',
    '[style.width]': 'vertical ? thickness : null',
    '[style.height]': '!vertical ? thickness : null',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteProgressStacked extends CuteBaseControl {

  /** Whether the stack of the containing progress bars is a vertical stack. Default is _false_, horizontal. */
  @Input({transform: booleanAttribute}) vertical: boolean = false;

  /** Bar's height for horizontal progress and width for vertical one. */
  @Input() thickness: string = DEFAULT_THICKNESS;

  protected override generateId(): string {
    return "";
  }

}
