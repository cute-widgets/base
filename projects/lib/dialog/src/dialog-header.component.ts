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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, HostListener,
  Input, OnInit, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {CuteButton} from "@cute-widgets/base/button";
import {CdkDrag, CdkDragHandle, DragAxis} from "@angular/cdk/drag-drop";
import {CuteDialogClose} from "./dialog-close.directive";
import {CuteDialogContainer} from "./dialog-container.component";
import {CuteDialogConfig} from "./dialog-config";

@Component({
    selector: 'cute-dialog-header',
    exportAs: 'cuteDialogHeader',
    template: `
      <div #header
           class="modal-header"
           role="heading"
           cdkDrag
           cdkDragRootElement=".cdk-overlay-pane"
           [cdkDragDisabled]="!draggable || container.isFullScreenDialog()"
           [style.cursor]="getCursorStyle()"
      >
          <ng-content select="[cute-dialog-title], [cuteDialogTitle]"></ng-content>
          <ng-content></ng-content>
          <button cuteButton="close-button" tabindex="-1" color="light" magnitude="smaller" cute-dialog-close></button>
      </div>
<!--      cdkDragHandle-->
  `,
    host: {
        'class': 'cute-dialog-header',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CuteButton,
        CdkDrag,
        CuteDialogClose
    ]
})
export class CuteDialogHeader implements OnInit {

  @ViewChild('header', {read: CdkDrag, static: true})
  protected cdkDragEl: CdkDrag | undefined;

  protected config: CuteDialogConfig;
  protected isMouseDown = false;

  /**
   * Whether it is possible to drag the `Dialog` by grabbing the header section.
   * The default value is the value of the `draggable` property from the `CuteDialogConfig` object,
   * or _false_ if the value is not defined.
   */
  @Input({transform: booleanAttribute})
  get draggable():boolean {return this._draggable;}
  set draggable(value: boolean) {this._draggable = value;}
  private _draggable: boolean = false;

  constructor(
    protected container: CuteDialogContainer
  ) {
    this.config = container._config;
    // Assign an initial value based on the `draggable` property of the `CuteDialogConfig` object.
    // User can override this value by setting his/her value to the `draggable` input property
    this.draggable = !!this.config.draggable;
  }

  protected getCursorStyle(): string {
    if (this.draggable && !this.container.isFullScreenDialog()) {
      return this.isMouseDown ? 'grabbing' : 'move'; //'grab';
    }
    return "default";
  }

  @HostListener("mousedown", ["$event"])
  protected onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
  }

  @HostListener("mouseup", ["$event"])
  protected onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
  }

  ngOnInit() {
    if (this.cdkDragEl && typeof(this.config.draggable) == "string") {
      // Drag constraints: x-axis | y-axis
      this.cdkDragEl.lockAxis = (this.config.draggable.charAt(0)) as DragAxis;
    }
  }

}
