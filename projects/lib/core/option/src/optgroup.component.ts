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
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  InjectionToken,
  booleanAttribute, inject,
} from '@angular/core';
import {CuteOptionParentComponent, CUTE_OPTION_PARENT_COMPONENT} from './option-parent.interface';

// Notes on the accessibility pattern used for `cute-optgroup`.
// The option group has two different "modes": regular and inert. The regular mode uses the
// recommended a11y pattern which has `role="group"` on the group element with `aria-labelledby`
// pointing to the label. This works for `cute-select`, but it seems to hit a bug for autocomplete
// under VoiceOver where the group doesn't get read out at all. The bug appears to be that if
// there's __any__ a11y-related attribute on the group (e.g. `role` or `aria-labelledby`),
// VoiceOver on Safari won't read it out.
// We've introduced the `inert` mode as a workaround. Under this mode, all a11y attributes are
// removed from the group, and we get the screen reader to read out the group label by mirroring it
// inside an invisible element in the option. This is suboptimal, because the screen reader will
// repeat the group label on each navigation, whereas the default pattern only reads the group when
// the user enters a new group. The following alternate approaches were considered:
// 1. Reading out the group label using the `LiveAnnouncer` solves the problem, but we can't control
//    when the text will be read out, so sometimes it comes in too late or never if the user
//    navigates quickly.
// 2. `<cute-option aria-describedby="groupLabel"` - This works on Safari, but VoiceOver in Chrome
//    won't read out the description at all.
// 3. `<cute-option aria-labelledby="optionLabel groupLabel"` - This works on Chrome, but Safari
//     doesn't read out the text at all. Furthermore, on

// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `CuteOptgroup`. It serves as
 * an alternative token to the actual `CuteOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const CUTE_OPTGROUP = new InjectionToken<CuteOptgroup>('CuteOptgroup');

/**
 * Component that is used to group instances of `mat-option`.
 */
@Component({
  selector: 'cute-optgroup',
  exportAs: 'cuteOptgroup',
  templateUrl: './optgroup.component.html',
  styleUrls: ['./optgroup.component.scss'],
  host: {
    'class': 'cute-optgroup',
    '[attr.role]': '_inert ? null : "group"',
    '[attr.aria-disabled]': '_inert ? null : disabled',
    '[attr.aria-labelledby]': '_inert ? null : _labelId',
  },
  providers: [{provide: CUTE_OPTGROUP, useExisting: CuteOptgroup}],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteOptgroup {
  /** Label for the option group. */
  @Input() label: string | undefined;

  /** whether the option group is disabled. */
  @Input({transform: booleanAttribute}) disabled: boolean = false;

  /** Unique id for the underlying label. */
  _labelId: string = `cute-optgroup-label-${_uniqueOptgroupIdCounter++}`;

  /** Whether the group is in inert a11y mode. */
  _inert: boolean;

  constructor(...args: unknown[]);
  constructor() {
    const parent = inject<CuteOptionParentComponent>(CUTE_OPTION_PARENT_COMPONENT, {optional: true});
    this._inert = parent?.inertGroups ?? false;
  }
}
