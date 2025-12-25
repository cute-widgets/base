import {DOCUMENT, inject, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MediaMatcher} from '@angular/cdk/layout';

const PREFERS_COLOR_SCHEME = '(prefers-color-scheme: dark)';
const THEME_ATTR_NAME = "data-bs-theme";

export type CuteTheme = "light" | "dark" | "auto";

@Injectable({
  providedIn: "root"
})
export class CuteThemeService implements OnDestroy {
  private _document = inject(DOCUMENT);
  private _mediaQueryList: MediaQueryList;
  private _mediaChange = new Subject<MediaQueryListEvent>();

  /** Observable that can be used to receive `MediaMatcher`'s _change_ event. */
  readonly change = this._mediaChange.asObservable();

  constructor() {
    const mediaMatcher = inject(MediaMatcher);
    this._mediaQueryList = mediaMatcher.matchMedia(PREFERS_COLOR_SCHEME);

    fromEvent<MediaQueryListEvent>(this._mediaQueryList, "change")
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        const storedTheme = this.getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
          this.setTheme( this.getPreferredTheme(), false );
        }
        this._mediaChange.next(event);
      });

    fromEvent(window, "DOMContentLoaded")
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.setTheme( this.getPreferredTheme() );
      });
  }

  private getStoredTheme(): CuteTheme|null {
    const theme = localStorage.getItem('theme');
    if (theme && ["light","dark","auto"].includes(theme)) {
      return theme as CuteTheme;
    }
    return null;
  }

  private setStoredTheme(theme: CuteTheme): void{
    return localStorage.setItem('theme', theme);
  }

  /** Returns the user's preferred color mode. */
  getPreferredTheme(): CuteTheme {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return this.getCurrentTheme();
  }

  /** Returns the browser's color theme. */
  getCurrentTheme(): CuteTheme {
    return this._mediaQueryList.matches ? 'dark' : 'light';
  }

  /** Whether is the dark theme currently selected. */
  isDarkTheme(): boolean {
    return this.getTheme() == "dark";
  }

  /** Whether is the light theme currently selected. */
  isLightTheme(): boolean {
    return !this.isDarkTheme();
  }

  /** Returns the Bootstrap's color theme. */
  getTheme(): Omit<CuteTheme, "auto"> {
    const docElem = this._document.documentElement;
    let attrValue = docElem.getAttribute(THEME_ATTR_NAME);
    if (attrValue == null) {
      attrValue = this.getCurrentTheme();
    }
    return attrValue;
  }

  /**
   * Changes the default color mode (theme) of all pages in the website with the opportunity of auto-detection.
   * @param theme Desired color theme.
   * @param emitEvent Emulate event emitting. Default is _true_.
   */
  setTheme(theme: CuteTheme, emitEvent: boolean = true): void {
    const docElem = this._document.documentElement;
    let matches: boolean;
    if (theme === 'auto') {
      matches = this._mediaQueryList.matches;
      docElem.setAttribute(THEME_ATTR_NAME, (matches ? 'dark' : 'light'));
    } else {
      matches = (theme === "dark");
      docElem.setAttribute(THEME_ATTR_NAME, theme);
    }
    this.setStoredTheme(theme);
    if (emitEvent) {
      // dispatch artificial (not trusted) change event
      this._mediaQueryList.dispatchEvent( new MediaQueryListEvent("change",  {matches, media: this._mediaQueryList.media}) );
    }
  }

  ngOnDestroy() {
    this._mediaChange.complete();
  }

}
