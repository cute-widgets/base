The `observers` package provides convenience directives built on top of native web platform observers, 
such as `MutationObserver` or `IntersectionObserver`.

### cuteObserveContent
A directive for observing when the content of the host element changes. An event is emitted when a mutation 
to the content is observed.

```html
<div class="projected-content-wrapper"
     [cuteObserveContentDisabled]="false"
     [cuteObserveContentDebounce]="0"
     (cuteObserveContent)="projectContentChanged($event)">
  <ng-content></ng-content>
</div>
```

### cuteObserveVisibility
A directive that triggers a callback whenever the visibility of its associated element has changed.

```html
<div class="projected-content-wrapper"
     [cuteObserveVisibility]="[0, 0.25, 0.5, 0.75, 1]"
     [cuteObserveVisibilityDisabled]="false"
     [cuteObserveVisibilityDebounce]="0"
     [cuteObserveVisibilityRoot]="null"
     [cuteObserveVisibilityRootMargin]="0px"
     (cuteObserveVisibility)="onVisibilityChanged($event)">
  <ng-content></ng-content>
</div>
```
