`<cute-slide-toggle>` is an on/off control that can be toggled via clicking.

<!-- example(slide-toggle-overview) -->

The slide-toggle behaves similarly to a checkbox, though it does not support an `indeterminate`
state like `<cute-checkbox>`.

### Slide-toggle label
The slide-toggle label is provided as the content to the `<cute-slide-toggle>` element.

If you don't want the label to appear next to the slide-toggle, you can use
[`aria-label`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-label) or
[`aria-labelledby`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby) to
specify an appropriate label.

### Use with `@angular/forms`
`<cute-slide-toggle>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Accessibility

`CuteSlideToggle` uses an internal `<button role="switch">` to provide an accessible experience. This
internal button receives focus and is automatically labelled by the text content of the
`<cute-slide-toggle>` element. Avoid adding other interactive controls into the content of
`<cute-slide-toggle>`, as this degrades the experience for users of assistive technology.

Always provide an accessible label via `aria-label` or `aria-labelledby` for toggles without
descriptive text content. For dynamic labels, `CuteSlideToggle` provides input properties for binding
`aria-label` and `aria-labelledby`. This means that you should not use the `attr.` prefix when
binding these properties, as demonstrated below.

```html
<cute-slide-toggle [aria-label]="isSubscribedToEmailsMessage">
</cute-slide-toggle>
```
