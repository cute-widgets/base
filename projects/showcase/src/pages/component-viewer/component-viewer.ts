import {Component, computed, inject, Input, input, model, TemplateRef} from '@angular/core';
import {ComponentHeader} from '../../shared/utils/component-header';
import {CuteAlertModule} from '@cute-widgets/base/alert';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteTabsModule} from '@cute-widgets/base/tabs';
import {MarkdownComponent} from 'ngx-markdown';
import {DocItem, DocItems} from '../../shared/documentation-items/doc-items';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-component-viewer',
  imports: [
    ComponentHeader,
    CuteAlertModule,
    CuteIconModule,
    CuteTabsModule,
    MarkdownComponent,
    NgTemplateOutlet
  ],
  templateUrl: './component-viewer.html',
  styleUrl: './component-viewer.scss',
})
export class ComponentViewer {
  protected _docItems = inject(DocItems);

  docItem = model<DocItem>();

  @Input()
  examplesTemplate: TemplateRef<any> | undefined;

  protected _docOverviewPath = computed(() => {
    const docItem = this.docItem();
    if (docItem) {
      return this._docItems.getOverviewPath(docItem);
    }
    return undefined;
  });
}
