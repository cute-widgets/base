/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  Directive, EventEmitter, forwardRef, inject,
  Input, numberAttribute, OnDestroy, Output,
} from "@angular/core";
import {CdkPortalOutlet} from "@angular/cdk/portal";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CuteNavItem} from "./nav-item.component";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {Subscription} from "rxjs";
import {getOverallTransitionDuration} from "@cute-widgets/base/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[cuteNavPaneOutlet]',
  exportAs: 'cuteNavPaneOutlet',
  inputs: ['portal: cuteNavPaneOutlet'],
  hostDirectives: [CdkScrollable],
  standalone: true,
})
export class CuteNavPaneOutlet extends CdkPortalOutlet implements OnDestroy  {
  private _pane: CuteNavPane = inject(forwardRef(() => CuteNavPane));

  constructor() {
    super();

    this._pane.show
      .pipe(takeUntilDestroyed())
      .subscribe(()=> {
      const panePortal = this._pane.item?.content;
      if (panePortal && !panePortal.isAttached) {
        panePortal.attach(this);
      }
    });
    this._pane.hide
      .pipe(takeUntilDestroyed())
      .subscribe(()=> {
      const item = this._pane.item;
      const panePortal = item?.content;
      if (panePortal && panePortal.isAttached) {
        if (!item?.preserveTabContent) {
          panePortal.detach();
        }
      }
    });
  }
}

@Directive({
  selector: '[cute-nav-pane], [cuteNavPane]',
  exportAs: 'cuteNavPane',
  host: {
    'class': 'cute-nav-pane tab-pane',
    '[class.fade]': 'item.nav.animation',
    '[class.active]': '_active',
    '[class.show]': '_show',
    '[attr.tabindex]': '0', //'_active ? 0 : -1',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    'role': 'tabpanel',
  },
  standalone: true,
})
export class CuteNavPane extends CuteLayoutControl {
  private _subs: Subscription | undefined;
  protected _active: boolean = false;
  protected _show: boolean = false;

  /** Pane index */
  @Input({transform: numberAttribute})
  index: number = NaN;

  /** Navigation item reference */
  @Input()
  item: CuteNavItem | undefined;

  @Output() hide = new EventEmitter<void>();
  @Output() show = new EventEmitter<void>();

  constructor() {
    super();
  }

  protected generateId(): string {
    return "";
  }

  override ngOnInit() {
    super.ngOnInit();

    this.id = `${this.item?.nav.id}-pane-${this.index}`;

    if (this.item) {
      this._subs = this.item.nav.selectedLinkChange.subscribe(ev => {
        this._active = (ev.index === this.index);
        if (this._active) {
          this.show.emit();
          setTimeout(()=> {
            this._show = true;
            this.markForCheck();
          }, getOverallTransitionDuration(this._nativeElement));
        } else {
          this.hide.emit();
          this._show = false;
        }
        this.markForCheck();
      });
    }

  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this._subs) {
      this._subs.unsubscribe();
    }
  }

}
