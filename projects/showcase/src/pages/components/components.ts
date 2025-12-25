import {AfterViewInit, Component, DOCUMENT, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CuteIcon} from '@cute-widgets/base/icon';
import {CuteNav, CuteNavLink} from '@cute-widgets/base/core/nav';
import {CuteSidenav, CuteSidenavContainer, CuteSidenavContent} from '@cute-widgets/base/sidenav';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CuteContainer} from '@cute-widgets/base/layout';
import {BASE_WIDGETS, DocItem, DocItems} from '../../shared/documentation-items/doc-items';
import {AppFooter} from '../../shared/app-footer/app-footer';

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

  constructor() {
  }

  @ViewChild(CuteSidenavContainer, {static: true}) sidenavContainer!: CuteSidenavContainer;
  @ViewChild("content", {read: CuteSidenavContent, static: true}) sidenavContent!: CuteSidenavContent;


  protected onRouterOutletActivate(): void {
    this._document.documentElement.scroll({top: 0, behavior: "smooth"});
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
