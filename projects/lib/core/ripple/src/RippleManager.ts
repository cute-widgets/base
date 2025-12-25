/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Ripple} from "./Ripple";

export class RippleManager {
    private static readonly _ripples = new WeakMap<HTMLElement, Ripple>();


    static getInstance(target: HTMLElement): Ripple {
        return RippleManager.createRipple(target);
    }

    static createRipple(target: HTMLElement): Ripple {

        if (!target) {
            throw new Error("'target' is required when instantiating a Ripple object")
        }
        let ripple = this._ripples.get(target);
        if (!ripple) {
            ripple = new RippleImpl(target);
            this._ripples.set(target, ripple);
        }
        return ripple;
    }

    static removeRipple(target: HTMLElement) {
        if (target) {
            let ripple = this._ripples.get(target);
            if (ripple) {
                ripple.stop();
            }
            this._ripples.delete(target);
        }
    }
}

class RippleImpl extends Ripple {
  constructor(target: HTMLElement) {
    super(target);
  }
}
