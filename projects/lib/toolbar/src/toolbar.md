`<cute-toolbar>` is a container for headers, titles, or actions.

```html
<cute-toolbar color="tertiary">
  <button cuteButton="icon-button" class="example-icon" aria-label="Example icon-button with menu icon">
    <cute-icon>list</cute-icon>
  </button>
  <span class="ms-1">My App</span>
  <span class="example-spacer"></span>
  <button cuteButton="icon-button" class="example-icon" aria-label="Example icon-button with heart icon">
    <cute-icon>heart-fill</cute-icon>
  </button>
  <button cuteButton="icon-button" class="example-icon" aria-label="Example icon-button with share icon">
    <cute-icon>share-fill</cute-icon>
  </button>
</cute-toolbar>
```

### Single row

In most situations, a toolbar will be placed at the top of your application and will only
have a single row that includes the title of your application.

```html
<cute-toolbar>
  <span>My Application</span>
</cute-toolbar>
```

### Multiple rows

The CuteWidgets' specifications describe that toolbars can also have multiple rows. Creating
toolbars with multiple rows in CuteWidgets can be done by placing `<cute-toolbar-row>` elements
inside a `<cute-toolbar>`.

```html
<cute-toolbar>
  <cute-toolbar-row>
    <span>Custom Toolbar</span>
  </cute-toolbar-row>
</cute-toolbar>
```

**Note**: Placing content outside a `<cute-toolbar-row>` when multiple rows are specified is not
supported.

### Positioning toolbar content
The toolbar does not perform any positioning of its content. This gives the user full power to
position the content as it suits their application.

A common pattern is to position a title on the left with some actions on the right. This can be
easily achieved with `display: flex`:

```html
<cute-toolbar-row>
  <span>Second Line</span>
  <span class="example-spacer"></span>
  <cute-icon class="example-icon" aria-hidden="false" aria-label="Example user verified icon">bi-person-check</cute-icon>
</cute-toolbar-row>
```

```css
/* css */
.example-spacer {
  flex: 1 1 auto;
}
```

### Theming
The color of a `<cute-toolbar>` can be changed by using the `color` input property. By default, toolbars
use a neutral background color based on the current theme (light or dark). This can be changed to
`'primary'`, `'secondary'`, `'warning'` and other Bootstrap's color themes.

### Sizing

The relative height of the `<cute-toolbar-row>` can be adjusted using its `magnitude` input property. By default,
toolbar row has a _middle_ size.

### Accessibility
By default, the toolbar assumes that it will be used in a purely decorative fashion and thus sets
no roles, ARIA attributes, or keyboard shortcuts. This is equivalent to having a sequence of `<div>`
elements on the page.

Generally, the toolbar is used as a header where `role="heading"` would be appropriate.

Only if the use-case of the toolbar matches that of role="toolbar", the user should add the role and
an appropriate label via `aria-label` or `aria-labelledby`.
