/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";

let uniqueId = 0;

@Component({
  selector: 'cute-dialog-stage',
  templateUrl: './dialog-stage.component.html',
  styleUrls: ['./dialog-stage.component.scss'],
  host: {
    'class': 'cute-dialog-stage modal-dialog modal-dialog-scrollable',
    '[attr.id]': 'id || null',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteDialogStage extends CuteLayoutControl {

  constructor() {
    super();
  }

  override generateId(): string {
    return `cute-dialog-stage-${uniqueId++}`;
  }

}
