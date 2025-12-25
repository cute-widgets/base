/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges, inject} from '@angular/core';

@Directive({
  selector: '[cuteTimeAgo]',
  standalone: true,
})
export class CuteTimeAgo implements OnChanges {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);

  @Input() cuteTimeAgo?: Date;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["cuteTimeAgo"]) {
      this.updateTimeAgo();
    }
  }

  private updateTimeAgo(): void {
    if (this.cuteTimeAgo instanceof Date) {
      const timeDifference = Date.now() - this.cuteTimeAgo.getTime();
      const secondsAgo = Math.floor(timeDifference / 1000);

      let text: string;

      if (secondsAgo < 60) {
        text = 'just now';
      } else if (secondsAgo < 3600) {
        const minutes = Math.floor(secondsAgo / 60);
        text = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (secondsAgo < 86400) {
        const hours = Math.floor(secondsAgo / 3600);
        text = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(secondsAgo / 86400);
        text = `${days} day${days > 1 ? 's' : ''} ago`;
      }

      this.renderer.setProperty(this.el.nativeElement, 'textContent', text);
    }
  }
}
