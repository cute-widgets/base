/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input} from "@angular/core";
import {CuteInputControl} from "./input-control.directive";
import {Expandable} from "./expandable.interface";

@Directive()
export abstract class CuteInputDropdownControl extends CuteInputControl implements Expandable {

    @Input()
    withShadow: boolean = false;

    protected constructor() {
        super();
    }

    /** Expandable interface */
    abstract open(): void;
    abstract close(): void;
    abstract toggle(): void;

    abstract get expanded(): boolean;
}
