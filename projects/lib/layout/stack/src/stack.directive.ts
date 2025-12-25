/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input, numberAttribute} from "@angular/core";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {LayoutDirection} from "@cute-widgets/base/core";

/**
 * Stacks offer a shortcut for applying a number of flexbox properties to quickly and easily create flex layouts.
 */
@Directive({
  selector: 'cute-stack',
  exportAs: 'cuteStack',
  standalone: true,
  host: {
    '[class]': "(direction=='column'?'v':'h')+'stack gap-'+gap",
    '[attr.gap]': 'null',
  }
})
export class CuteStack extends CuteLayoutControl {

  /** Direction of the child components. */
  @Input()
  get direction(): LayoutDirection {return this._direction};
  set direction(value: LayoutDirection) {
    this.setDirection(value);
  }
  protected _direction: LayoutDirection = "column";

  /** Spacing level (0..5) between the child components. */
  @Input({transform: numberAttribute})
  get gap(): number {return this._gap;}
  set gap(value: number) {
    const MAX_GAP= 5;
    value = Math.round(value);
    this._gap = Math.min(Math.max(value, 0), MAX_GAP);
  }
  private _gap:number = 0;


  constructor() {
    super();
  }

  protected setDirection(value: LayoutDirection): void {
    this._direction = value;
  }

  protected override generateId(): string {
    return "";  /* no auto */
  }

}
