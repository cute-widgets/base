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
  Input, numberAttribute, OnDestroy, Output, signal,
} from "@angular/core";
import {CdkPortalOutlet} from "@angular/cdk/portal";
import {CdkScrollable} from "@angular/cdk/overlay";
import {CuteNavItem} from "./nav-item.component";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {Subscription} from "rxjs";
import {getOverallTransitionDuration} from "@cute-widgets/base/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

//let navPaneId: number = 0;

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
    '[class.fade]': 'item?.nav?._animationEnabled',
    '[class.active]': '_active()',
    '[class.show]': '_show()',
    '[attr.tabindex]': '0', //'_active ? 0 : -1',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    'role': 'tabpanel',
  },
  standalone: true,
})
export class CuteNavPane extends CuteLayoutControl {
  private _subs: Subscription | undefined;
  protected _active = signal<boolean>(false);
  protected _show = signal<boolean>(false);

  /** Pane index. */
  @Input({transform: numberAttribute, required: true})
  index: number = NaN;

  /** Navigation item reference. */
  @Input({required: true})
  item!: CuteNavItem;

  @Output() hide = new EventEmitter<void>();
  @Output() show = new EventEmitter<void>();

  constructor() {
    super();
  }

  protected generateId(): string {
    return ""; //`cute-nav-pane${navPaneId++}`;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.id = `${this.item.nav.id}-pane-${this.index}`;

    if (this.item) {
      this._subs = this.item.nav.selectedLinkChange.subscribe(ev => {
        this._active.set(ev.index === this.index);
        if (this._active()) {
          setTimeout(()=> {
            this._show.set(true);
            this.show.emit();
            //this.markForCheck();
          }, getOverallTransitionDuration(this._nativeElement));
        } else {
          this._show.set(false);
          this.hide.emit();
        }
        //this.markForCheck();
      });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._subs?.unsubscribe();
  }

}
