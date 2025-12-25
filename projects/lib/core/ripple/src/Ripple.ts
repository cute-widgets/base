/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {computed, signal} from "@angular/core";
import {firstValueFrom, fromEvent} from "rxjs";
import {take} from "rxjs/operators";

const RIPPLE_CLASS_NAME = "cute-ripple-element";

export type RippleOptions = {centered?: boolean, color?: string|null, duration?: string|number};

export abstract class Ripple {
    private _active = signal<boolean>(false);
    private _disabled: boolean = false;
    private readonly _target: HTMLElement | undefined;

    protected constructor(target: HTMLElement) {
        this._target = target;
    }

    get disabled(): boolean {return this._disabled}
    set disabled(v: boolean) {this._disabled = v;}

    isActive = computed(() => this._active());

    stop(): void {
        if (this._target) {
            const existingRipple = this._target.getElementsByClassName(RIPPLE_CLASS_NAME)[0];
            if (existingRipple) {
              existingRipple.parentElement?.remove();
            }
        }
        this._active.set(false);
    }

    launch(event: MouseEvent, options?: RippleOptions): void {

      if (this.disabled) {
        return;
      }

      if (this.isActive()) {
        this.stop();
      }

      if (this._target && event) {
        const rect = this._target.getBoundingClientRect();

        const parent = document.createElement("div");
        parent.style.position = "absolute";
        parent.style.top = "0";
        parent.style.right = "0";
        parent.style.bottom = "0";
        parent.style.left = "0";
        parent.style.overflow = "hidden";
        parent.style.borderRadius = "inherit";
        parent.style.transform = "perspective(0)";
        parent.ariaHidden = "true";
        parent.classList.add("cute-ripple")

        const circle = document.createElement("span");
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter/2;

        circle.style.width = circle.style.height = `${diameter}px`;
        if (options?.centered) {
          circle.style.left = `${rect.width / 2 - radius}px`;
          circle.style.top = `${rect.height / 2 - radius}px`;
        } else {
          circle.style.left = `${event.clientX - rect.left - radius}px`;
          circle.style.top = `${event.clientY - rect.top - radius}px`;
        }
        if (options?.color) {
          circle.style.setProperty("--cute-ripple-bg-color", options.color);
        }
        if (options?.duration) {
          circle.style.setProperty("--cute-ripple-duration", String(options.duration));
        }
        circle.classList.add(RIPPLE_CLASS_NAME);

        parent.appendChild(circle);
        this._target.appendChild(parent);

        this._active.set(true);

        Promise.any([
          firstValueFrom(fromEvent(circle, "animationend").pipe(take(1))),
          firstValueFrom(fromEvent(circle, "animationcancel").pipe(take(1))),
          //firstValueFrom(fromEvent(document, "mouseup").pipe(take(1))),
        ]).then(() => {
          circle.parentElement?.remove();
          this._active.set(false);
        })

      }
    }

}
