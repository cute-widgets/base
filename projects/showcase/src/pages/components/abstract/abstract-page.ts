import {computed, Directive, effect, inject, signal} from "@angular/core";
import {ActivatedRoute} from '@angular/router';
import {BASE_WIDGETS, DocItem, DocItems} from '../../../shared/documentation-items/doc-items';

@Directive({
  selector: '[abstractPage]',
})
export abstract class AbstractPage /* extends ... */ {
  protected _activatedRoute = inject(ActivatedRoute);
  private _docItems = inject(DocItems);
  protected _docItem = signal<DocItem | undefined>(undefined);

  protected _docOverviewPath = computed(() => {
    const docItem = this._docItem();
    if (docItem) {
      return this._docItems.getOverviewPath(docItem);
    }
    return undefined;
  });

  protected constructor() {
    const path = this._activatedRoute.snapshot.url[0].path ?? "";
    this._docItems.getItemById(path, BASE_WIDGETS)
      .then(item => this._docItem.set(item));
  }

  /**
   * Capitalized the first letter of a string.
   * @param s Source string
   * @returns Proper string
   */
  proper(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

}
