import {Component, ElementRef, inject, OnInit, SecurityContext, ViewEncapsulation} from '@angular/core';
import {CuteContainer} from '@cute-widgets/base/layout';
import {DocItem, DocItems, PRO_WIDGETS} from '../../../shared/documentation-items/doc-items';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteIcon} from '@cute-widgets/base/icon';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {CuteSafePipe} from '@cute-widgets/base/core';

@Component({
  selector: 'app-pro-overview',
  imports: [
    CuteContainer,
    CuteListModule,
    CuteIcon,
    CuteSafePipe,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  host: {
    'class': 'app-pro-overview',
  },
  // changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OverviewProPage implements OnInit {
  private _docItems = inject(DocItems);
  private _domSan = inject(DomSanitizer);
  protected items: DocItem[] = [];

  ngOnInit() {
    this._docItems.getItems(PRO_WIDGETS).then(docItems => {
      this.items = [...docItems];
    });
  }

}
