/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, ElementRef, HostListener, Input, OnDestroy} from "@angular/core";
import {Ripple, RippleOptions} from "./Ripple";
import {RippleManager} from "./RippleManager";

@Directive({
  selector: '[cuteRipple]',
  exportAs: 'cuteRipple',
  host: {},
  standalone: true,
})
export class CuteRipple /* extends ... */ implements OnDestroy {
  private readonly _ripple: Ripple | undefined;

  @Input("cuteRipple")
  rippleOptions: RippleOptions | undefined;

  @HostListener("mousedown", ['$event'])
  protected onMouseDown(event: MouseEvent) {
    if (this._ripple) {
      this._ripple.launch(event, this.rippleOptions);
    }
  }

  constructor(private _elemRef: ElementRef<HTMLElement>) {
    this._ripple = RippleManager.createRipple(_elemRef.nativeElement);
  }

  ngOnDestroy() {
    RippleManager.removeRipple(this._elemRef.nativeElement);
  }

}
