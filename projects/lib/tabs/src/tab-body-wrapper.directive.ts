import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';
import {CUTE_TAB_GROUP} from './tab-group.component';

@Directive({
  selector: '[cuteTabBodyWrapper]',
  exportAs: 'cuteTabBodyWrapper',
  host: {
    'class': 'tab-body-wrapper',
  },
})
export class CuteTabBodyWrapper implements AfterViewInit {
  protected _tabGroup = inject(CUTE_TAB_GROUP);
  protected _elementRef = inject(ElementRef);
  protected _initHeight: number | null = null;

  constructor() {}

  ngAfterViewInit() {
    if (!this._initHeight && !this._tabGroup.dynamicHeight && ["top","bottom"].indexOf(this._tabGroup.headerPosition)>=0) {

      const wrapper = this._elementRef.nativeElement;
      const style = getComputedStyle(wrapper);
      const rect = wrapper.getBoundingClientRect();
      if (style.height != "") {
        this._initHeight = parseFloat(style.height);
        if (this._initHeight > 0) {
          wrapper.style.height = this._initHeight + 'px';
        }
      }
      // console.debug("Wrapper.Height=", style.height);
    }
  }

}
