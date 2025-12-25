import {Component, inject, OnDestroy, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CuteToolbarModule} from '@cute-widgets/base/toolbar';
import {CuteNavbarModule} from '@cute-widgets/base/navbar';
import {CuteIconModule, CuteIconRegistry} from '@cute-widgets/base/icon';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteContainerModule} from '@cute-widgets/base/layout';
import {CuteSidenavModule} from '@cute-widgets/base/sidenav';
import {CuteThemeService} from '@cute-widgets/base/core';
import {CuteButtonToggleModule} from '@cute-widgets/base/button-toggle';
import {CuteNavModule} from '@cute-widgets/base/core/nav';
import {DomSanitizer} from '@angular/platform-browser';
import {CuteTheme} from '@cute-widgets/base/core/theming';
import {CuteClickOutside} from '@cute-widgets/base/core/directives';
import {AppFooter} from '../shared/app-footer/app-footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CuteToolbarModule,
    CuteNavbarModule,
    CuteIconModule,
    CuteButtonModule,
    CuteListModule,
    CuteInputModule,
    CuteSidenavModule,
    CuteButtonToggleModule,
    CuteNavModule,
    CuteContainerModule,
    CuteClickOutside,
    AppFooter,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  protected readonly title = signal('showcase');
  protected readonly themeService = inject(CuteThemeService);
  protected readonly iconRegistry = inject(CuteIconRegistry);
  protected readonly sanitizer = inject(DomSanitizer);

  protected currentTheme = signal<CuteTheme|undefined>(undefined);

  constructor() {

    this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl("assets/svg/bootstrap-icons.svg"), {width: '1em', height: '1em'});

    this.themeService.change.subscribe(event => {
      this.currentTheme.set(event.matches ? "dark" : "light");
    });
  }

  onRouterOutletActivate(): void {
    resetScrollPosition();
  }

  debug(event: Event) {
    console.debug(event);
  }


  footerVisibilityChange(entries: IntersectionObserverEntry[]) {
    console.debug("footer visibility: ", entries);
  }

  ngOnDestroy() {

  }

}

function resetScrollPosition() {
  if (typeof document === 'object' && document) {
    document.documentElement.scroll({top: 0, behavior: "smooth"});
    // const sidenavContent = document.querySelector('.cute-drawer-content');
    // if (sidenavContent) {
    //   sidenavContent.scrollTop = 0;
    // }
  }
}
