`<cute-progress-bar>` is a horizontal progress-bar for indicating progress and activity. 
Use progress bar to provide users with a visual representation of percentage complete for long-running operations.
`<cute-progress-bar>` can be vertical or horizontal and can display either percent complete or programmatically specified text.

### Progress mode
The progress-bar supports two modes: `determinate`, `indeterminate`.

#### Determinate
Operations where the percentage of the operation complete is known should use the
determinate indicator.

```html
<cute-progress-bar mode="determinate" value="40"></cute-progress-bar>
```

This is the default mode and the progress is represented by the `value` property.

#### Indeterminate
Operations where the user is asked to wait while something finishes, and it’s
not necessary to indicate how long it will take should use the indeterminate indicator.

```html
<cute-progress-bar mode="indeterminate"></cute-progress-bar>
```

In this mode the `value` property is ignored.

### Horizontal & Vertical

The progress-bar can be presented in two variants: horizontal and vertical. Default presentation is `horizontal`.
To change the progress-bar to the `vertical` view use the same-name input property. 

### Multiple bars

You can include multiple progress bars inside a `cute-progress-stacked` component to create a single _stacked_ progress bar.

### Accessibility

`CuteProgressBar` implements the ARIA `role="progressbar"` pattern. By default, the progress bar
sets `aria-valuemin` to `0` and `aria-valuemax` to `100`. Avoid changing these values, as this may
cause incompatibility with some assistive technology.

Always provide an accessible label via `aria-label` or `aria-labelledby` for each progress bar.
