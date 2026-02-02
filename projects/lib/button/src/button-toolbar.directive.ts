/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  Directive, InjectionToken,
  Input, numberAttribute,
} from "@angular/core";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {RelativeSize5} from "@cute-widgets/base/core/types";

// Counter used to generate unique IDs.
let uniqueIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `CuteButtonToolbar`.
 * It serves as an alternative token to the actual `CuteButtonToolbar` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const CUTE_BUTTON_TOOLBAR = new InjectionToken<CuteButtonToolbar>(
  'CuteButtonToolbar',
);


/**
 * Combines sets of button groups into button toolbars for more complex components.
 */
@Directive({
  selector: "cute-button-toolbar",
  exportAs: "cuteButtonToolbar",
  host: {
    'class': 'cute-button-toolbar btn-toolbar',
    '[class]': '"gap-"+gap',
    '[attr.gap]': 'null',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    '[attr.aria-describedby]': 'ariaDescribedby || null',
    '[id]': 'id || null',
    'role':  'toolbar',
  },
  providers: [{provide: CUTE_BUTTON_TOOLBAR, useExisting: CuteButtonToolbar}],
  standalone: true
})
export class CuteButtonToolbar extends CuteFocusableControl {

    //@Input({transform: booleanAttribute}) vertical: boolean = false;

    private _gap:number = 0;

    /** The gutter between button groups. */
    @Input({transform: numberAttribute})
    get gap(): number {return this._gap;}
    set gap(value: number) {
        const MAX_GAP= 5;
        value = Math.round(value);
        if (value >= 0 && value <= MAX_GAP) {
            this._gap = value;
        } else if (value > MAX_GAP) {
            this._gap = MAX_GAP;
        } else {
            this._gap = 0;
        }
    }

    @Input() magnitude: RelativeSize5 | undefined;

    /** Child buttons. */
    //@ContentChildren(CUTE_BUTTON_BASE, {descendants: true})
    //_buttons: QueryList<ButtonBase> | undefined;

    constructor() {
        super();
    }

    protected override generateId(): string {
        return `button-toolbar-${++uniqueIdCounter}`;
    }

}
