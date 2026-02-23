import {
  Component,
  computed, effect, EventEmitter,
  inject,
  Injectable,
  Input,
  model, OnDestroy, Output,
  SecurityContext, signal,
  TemplateRef
} from '@angular/core';
import {ComponentHeader} from '../../shared/utils/component-header';
import {CuteAlertModule} from '@cute-widgets/base/alert';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteTabChangeEvent, CuteTabsModule} from '@cute-widgets/base/tabs';
import {MarkdownComponent} from 'ngx-markdown';
import {DocItem, DocItems} from '../../shared/documentation-items/doc-items';
import {NgTemplateOutlet} from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, shareReplay, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({providedIn: 'root'})
class DocFetcher {
  private _http = inject(HttpClient);

  private _cache: Record<string, Observable<string>> = {};

  fetchDocument(url: string): Observable<string> {
    if (this._cache[url]) {
      return this._cache[url];
    }

    const stream = this._http.get(url, {responseType: 'text'}).pipe(shareReplay(1));
    return stream.pipe(tap(() => (this._cache[url] = stream)));
  }
}


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
export class ComponentViewer implements OnDestroy {
  private _documentFetchSubscription: Subscription | undefined;
  protected _docItems = inject(DocItems);
  private _docFetcher = inject(DocFetcher);
  private _domSanitizer = inject(DomSanitizer);

  protected _docContent = signal<string>("");

  docItem = model<DocItem>();

  @Input()
  examplesTemplate: TemplateRef<any> | undefined;

  @Output() selectedTabChange = new EventEmitter<CuteTabChangeEvent>();

  protected _docOverviewPath = computed(() => {
    const docItem = this.docItem();
    if (docItem) {
      return this._docItems.getOverviewPath(docItem);
    }
    return undefined;
  });

  constructor() {
    effect(() => {
      const path = this._docOverviewPath();
      if (path) {
        this._fetchDocument(path)
      }
    });
  }

  /** Fetch a document by URL. */
  private _fetchDocument(url: string) {
    this._documentFetchSubscription?.unsubscribe();
    this._documentFetchSubscription = this._docFetcher.fetchDocument(url).subscribe(
      document => this._updateDocument(document),
      error => this._showError(url, error),
    );
  }

  /**
   * Updates the displayed document.
   * @param rawDocument The raw document content to show.
   */
  private _updateDocument(rawDocument: string) {
    // Replace all relative fragment URLs with absolute fragment URLs. e.g. "#my-section" becomes
    // "/components/button/api#my-section". This is necessary because otherwise these fragment
    // links would redirect to "/#my-section".
    rawDocument = rawDocument.replace(/href="#([^"]*)"/g, (_m: string, fragmentUrl: string) => {
      const absoluteUrl = `${location.pathname}#${fragmentUrl}`;
      return `href="${this._domSanitizer.sanitize(SecurityContext.URL, absoluteUrl)}"`;
    });

    this._docContent.set(rawDocument);
  }

  /** Show an error that occurred when fetching a document. */
  private _showError(url: string, error: HttpErrorResponse) {
    console.error(error);
    this._docContent.set(`Failed to load document: ${url}. Error: ${error.statusText}`);
  }

  ngOnDestroy() {
    this._documentFetchSubscription?.unsubscribe();
  }
}
