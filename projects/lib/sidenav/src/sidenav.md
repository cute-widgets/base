`CuteWidgets` provides two sets of components designed to add collapsible side content (often
navigation, though it can be any content) alongside some primary content. These are the **sidenav** and
**drawer** components.

The sidenav components are designed to add side content to a fullscreen app. To set up a sidenav, we
use three components: `<cute-sidenav-container>` which acts as a structural container for our content
and sidenav, `<cute-sidenav-content>` which represents the main content, and `<cute-sidenav>` which
represents the added side content.

```html
 <cute-sidenav-container class="example-container">
    <cute-sidenav mode="side" opened>Sidenav content</cute-sidenav>
    <cute-sidenav-content>Main content</cute-sidenav-content>
  </cute-sidenav-container>

```

The drawer component is designed to add side content to a small section of your app. This is
achieved using the `<cute-drawer-container>`, `<cute-drawer-content>`, and `<cute-drawer>`
components, which are analogous to their sidenav equivalents. Rather than adding side content to the
app as a whole, these are designed to add side content to a small section of your app. They support
almost all of the same features, but do not support fixed positioning.

<!-- example(sidenav-drawer-overview) -->

### Specifying the main and side content

Both the main and side content should be placed inside the `<cute-sidenav-container>`, content
that you don't want to be affected by the sidenav, such as a header or footer, can be placed outside
of the container.

The side content should be wrapped in a `<cute-sidenav>` element. The `position` property can be used
to specify which end of the main content to place the side content on. `position` can be either
`start` or `end` which places the side content on the left or right respectively in left-to-right
languages. If the `position` is not set, the default value of `start` will be assumed. A
`<cute-sidenav-container>` can have up to two `<cute-sidenav>` elements total, but only one for any
given side. The `<cute-sidenav>` must be placed as an immediate child of the `<cute-sidenav-container>`.

The main content should be wrapped in a `<cute-sidenav-content>`. If no `<cute-sidenav-content>` is
specified for a `<cute-sidenav-container>`, one will be created implicitly and all of the content
inside the `<cute-sidenav-container>` other than the `<cute-sidenav>` elements will be placed inside
of it.

<!-- example(sidenav-position) -->

The following are examples of valid sidenav layouts:

```html
<!-- Creates a layout with a left-positioned sidenav and explicit content. -->
<cute-sidenav-container>
  <cute-sidenav>Start</cute-sidenav>
  <cute-sidenav-content>Main</cute-sidenav-content>
</cute-sidenav-container>
```

```html
<!-- Creates a layout with a left and right sidenav and implicit content. -->
<cute-sidenav-container>
  <cute-sidenav>Start</cute-sidenav>
  <cute-sidenav position="end">End</cute-sidenav>
  <section>Main</section>
</cute-sidenav-container>
```

```html
<!-- Creates an empty sidenav container with no sidenavs and implicit empty content. -->
<cute-sidenav-container></cute-sidenav-container>
```

And these are examples of invalid sidenav layouts:

```html
<!-- Invalid because there are two `start` position sidenavs. -->
<cute-sidenav-container>
  <cute-sidenav>Start</cute-sidenav>
  <cute-sidenav position="start">Start 2</cute-sidenav>
</cute-sidenav-container>
```

```html
<!-- Invalid because there are multiple `<cute-sidenav-content>` elements. -->
<cute-sidenav-container>
  <cute-sidenav-content>Main</cute-sidenav-content>
  <cute-sidenav-content>Main 2</cute-sidenav-content>
</cute-sidenav-container>
```

```html
<!-- Invalid because the `<cute-sidenav>` is outside of the `<cute-sidenav-container>`. -->
<cute-sidenav-container></cute-sidenav-container>
<cute-sidenav></cute-sidenav>
```

These same rules all apply to the drawer components as well.

### Opening and closing a sidenav

A `<cute-sidenav>` can be opened or closed using the `open()`, `close()` and `toggle()` methods. Each
of these methods returns a `Promise<boolean>` that will be resolved with `true` when the sidenav
finishes opening or `false` when it finishes closing.

The opened state can also be set via a property binding in the template using the `opened` property.
The property supports 2-way binding.

`<cute-sidenav>` also supports output properties for just open and just close events, The `(opened)`
and `(closed)` properties respectively.

<!-- example(sidenav-open-close) -->

All of these properties and methods work on `<cute-drawer>` as well.

### Changing the sidenav's behavior

The `<cute-sidenav>` can render in one of three different ways based on the `mode` property.

| Mode   | Description                                                                                                           |
|--------|-----------------------------------------------------------------------------------------------------------------------|
| `over` | Sidenav floats over the primary content, which is covered by a backdrop                                               |
| `push` | Sidenav pushes the primary content out of its way, also covering it with a backdrop                                   |
| `side` | Sidenav appears side-by-side with the main content, shrinking the main content's width to make space for the sidenav. |

If no `mode` is specified, `over` is used by default.

<!-- example(sidenav-mode) -->

The `over` and `push` sidenav modes show a backdrop by default, while the `side` mode does not. This
can be customized by setting the `hasBackdrop` property on `cute-sidenav-container`. Explicitly
setting `hasBackdrop` to `true` or `false` will override the default backdrop visibility setting for
all sidenavs regardless of mode. Leaving the property unset or setting it to `null` will use the
default backdrop visibility for each mode.

<!-- example(sidenav-backdrop) -->

`<cute-drawer>` also supports all of these same modes and options.

### Disabling automatic close

Clicking on the backdrop or pressing the <kbd>Esc</kbd> key will normally close an open sidenav.
However, this automatic closing behavior can be disabled by setting the `disableClose` property on
the `<cute-sidenav>` or `<cute-drawer>` that you want to disable the behavior for.

Custom handling for <kbd>Esc</kbd> can be done by adding a keydown listener to the `<cute-sidenav>`.
Custom handling for backdrop clicks can be done via the `(backdropClick)` output property on
`<cute-sidenav-container>`.

<!-- example(sidenav-disable-close) -->

### Resizing an open sidenav
By default, `CuteWidgets` will only measure and resize the drawer container in a few key moments
(on open, on window resize, on mode change) in order to avoid layout thrashing, however, there
are cases where this can be problematic. If your app requires for a drawer to change its width
while it is open, you can use the `autosize` option to tell `CuteWidgets` to continue measuring it.
Note that you should use this option **at your own risk**, because it could cause performance
issues.

<!-- example(sidenav-autosize) -->

### Setting the sidenav size

The `<cute-sidenav>` and `<cute-drawer>` will, by default, fit the size of its content. The width can
be explicitly set via CSS:

```css
cute-sidenav {
  width: 200px;
}
```

>Try to avoid percent-based width as `resize` events are not (yet) supported.

### Sidenav's container height
The height of the `<cute-sidenav-container` is determined by the height of its nested main content -
`<cute-sidenav-content>` component, that is created explicitly or implicitly. The same
behavior applies to the drawer containers also.

### Fixed position sidenavs

For `<cute-sidenav>` only (not `<cute-drawer>`) fixed positioning is supported. It can be enabled by
setting the `fixedInViewport` property. Additionally, top and bottom space can be set via the
`fixedTopGap` and `fixedBottomGap`. These properties accept a pixel value amount of space to add at
the top or bottom.

```html
<cute-toolbar class="example-header">Header</cute-toolbar>

  <cute-sidenav-container class="example-container">
    <cute-sidenav #sidenav mode="side" opened class="example-sidenav"
                 [fixedInViewport]="options.value.fixed" [fixedTopGap]="options.value.top"
                 [fixedBottomGap]="options.value.bottom">
      {{options.value.fixed ? 'Fixed' : 'Non-fixed'}} Sidenav
    </cute-sidenav>

    <cute-sidenav-content [formGroup]="options">
      <p><cute-checkbox formControlName="fixed">Fixed</cute-checkbox></p>
      <p><cute-form-field>
        <cute-label>Top gap</cute-label>
        <input cuteInput type="number" formControlName="top">
      </cute-form-field></p>
      <p><cute-form-field>
        <cute-label>Bottom gap</cute-label>
        <input cuteInput type="number" formControlName="bottom">
      </cute-form-field></p>
      <p><button cuteButton (click)="sidenav.toggle()">Toggle</button></p>
    </cute-sidenav-content>
  </cute-sidenav-container>

  <cute-toolbar class="example-footer">Footer</cute-toolbar>
```

### Creating a responsive layout for mobile & desktop

A sidenav often needs to behave differently on a mobile vs a desktop display. On a desktop, it may
make sense to have just the content section scroll. However, on mobile you often want the body to be
the element that scrolls; this allows the address bar to auto-hide. The sidenav can be styled with
CSS to adjust to either type of device.

<!-- example(sidenav-responsive) -->

### Reacting to scroll events inside the sidenav container

To react to scrolling inside the `<cute-sidenav-container>`, you can get a hold of the underlying
`CdkScrollable` instance through the `CuteSidenavContainer`.

```ts
class YourComponent implements AfterViewInit {
  @ViewChild(CuteSidenavContainer) sidenavContainer: CuteSidenavContainer;

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled().subscribe(() => /* react to scrolling */ {});
  }
}
```

### Accessibility

The `<cute-sidenav>` and `<cute-sidenav-content>` should each be given an appropriate `role` attribute
depending on the context in which they are used.

For example, a `<cute-sidenav>` that contains links
to other pages might be marked `role="navigation"`, whereas one that contains a table of
contents about might be marked as `role="directory"`. If there is no more specific role that
describes your sidenav, `role="region"` is recommended.

Similarly, the `<cute-sidenav-content>` should be given a role based on what it contains. If it
represents the primary content of the page, it may make sense to mark it `role="main"`. If no more
specific role makes sense, `role="region"` is again a good fallback.

#### Focus management
The sidenav has the ability to capture focus. This behavior is turned on for the `push` and `over` modes and it is off for `side` mode. You can change its default behavior by the `autoFocus` input.

By default, the first tabbable element will receive focus upon open. If you want a different element to be focused, you can set the `cdkFocusInitial` attribute on it.

### Troubleshooting

#### Error: A drawer was already declared for 'position="..."'

This error is thrown if you have more than one sidenav or drawer in a given container with the same
`position`. The `position` property defaults to `start`, so the issue may just be that you forgot to
mark the `end` sidenav with `position="end"`.
