import {CuteCollapseBase} from '@cute-widgets/base/collapse';
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'cute-navbar-collapse',
  templateUrl: './navbar-collapse.component.html',
  styleUrl: './navbar-collapse.component.scss',
  exportAs: 'cuteNavbarCollapse',
  host: {
    'class': 'cute-navbar-collapse',
    '[class]': '"cute-navbar-collapse-"+(horizontal ? "horizontal" : "vertical")+" "+getState()',
    '[class.cute-navbar-collapse-animations-enabled]': '!disableAnimation',
    '[id]': 'id || null',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteNavbarCollapse extends CuteCollapseBase {}
