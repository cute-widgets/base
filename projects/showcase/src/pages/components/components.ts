import {
  AfterViewInit,
  Component,
  DOCUMENT,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  ViewChild
} from '@angular/core';
import {CuteIcon} from '@cute-widgets/base/icon';
import {CuteNav, CuteNavLink} from '@cute-widgets/base/core/nav';
import {CuteSidenav, CuteSidenavContainer, CuteSidenavContent} from '@cute-widgets/base/sidenav';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CuteContainer} from '@cute-widgets/base/layout';
import {BASE_WIDGETS, DocItem, DocItems} from '../../shared/documentation-items/doc-items';
import {BreakpointState} from '@angular/cdk/layout';
import {bsBreakpoints} from '@cute-widgets/base/core';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteClickOutside} from '@cute-widgets/base/core/directives';

@Component({
  selector: 'app-components',
  imports: [
    CuteIcon,
    CuteNav,
    CuteNavLink,
    CuteSidenav,
    CuteSidenavContainer,
    CuteSidenavContent,
    RouterLink,
    RouterOutlet,
    CuteContainer,
    CuteButton,
    CuteClickOutside,
    //AppFooter,
    // RouterLinkActive,
    // RouterOutlet
  ],
  templateUrl: './components.html',
  styleUrl: './components.scss',
})
export class ComponentsPage implements OnInit, OnDestroy, AfterViewInit {
  private _document = inject(DOCUMENT);
  private _docItems = inject(DocItems);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  protected items: DocItem[] = [];

  protected sidenav = viewChild(CuteSidenav);
  protected isScreenMedium = signal<boolean>(false);
  protected isScreenSmall = signal<boolean>(false);

  constructor() {
  }

  @ViewChild(CuteSidenavContainer, {static: true}) sidenavContainer!: CuteSidenavContainer;
  @ViewChild("content", {read: CuteSidenavContent, static: true}) sidenavContent!: CuteSidenavContent;

  protected onRouterOutletActivate(): void {
    this._document.documentElement.scroll({top: 0, behavior: "smooth"});
  }

  protected onBreakpointState(state: BreakpointState) {
    for (const [query, bool] of Object.entries(state.breakpoints)) {
      const name = bsBreakpoints.getQueryName(query);
      if (name) {
        if (name.startsWith("Large")) {
          this.isScreenMedium.set(bool);
        }
        if (name.startsWith("Medium")) {
          this.isScreenSmall.set(bool);
        }
      }
    }
  }

  toggleSidenav(): void {
    this.sidenav()?.toggle();
  }

  ngOnInit() {
    this._docItems.getItems(BASE_WIDGETS).then(docItems => this.items = [...docItems]);
  }

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(e => {
      console.debug("scrolled event: ", e);
    });
  }

  ngOnDestroy() {
  }

}
