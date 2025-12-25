`<cute-button-toggle>` are on/off toggles with the appearance of a button. These toggles can be
configured to behave as either radio-buttons or checkboxes. While they can be standalone, they are
typically part of a `cute-button-toggle-group`.

<!-- example(button-toggle-overview) -->

### Exclusive selection vs. multiple selection
By default, `cute-button-toggle-group` acts like a radio-button group - only one item can be selected.
In this mode, the `value` of the `cute-button-toggle-group` will reflect the value of the selected
button and `ngModel` is supported.

Adding the `multiple` attribute allows multiple items to be selected (checkbox behavior). In this
mode the values of the toggles are not used, the `cute-button-toggle-group` does not have a value,
and `ngModel` is not supported.

<!-- example(button-toggle-mode) -->

### Appearance
The appearance of `cute-button-toggle-group` and `cute-button-toggle` will follow the
latest Bootstrap Design guidelines. 

<!-- example(button-toggle-appearance) -->

### Use with `@angular/forms`
`<cute-button-toggle-group>` is compatible with `@angular/forms` and supports both `FormsModule`
and `ReactiveFormsModule`.

### Orientation
The button-toggles can be rendered in a vertical orientation by adding the `vertical` attribute.

### Accessibility
`CuteButtonToggle` internally uses native `button` elements with `aria-pressed` to convey toggle
state. If a toggle contains only an icon, you should specify a meaningful label via `aria-label`
or `aria-labelledby`. For dynamic labels, `CuteButtonToggle` provides input properties for binding
`aria-label` and `aria-labelledby`. This means that you should not use the `attr.` prefix when
binding these properties, as demonstrated below.

```html
<cute-button-toggle [aria-label]="alertsEnabled ? 'Disable alerts' : 'Enable alerts'">
  <cute-icon>notifications</cute-icon>
</cute-button-toggle>
```

The `CuteButtonToggleGroup` surrounding the individual buttons applies
`role="group"` to convey the association between the individual toggles. Each
`<cute-button-toggle-group>` element should be given a label with `aria-label` or `aria-labelledby`
that communicates the collective meaning of all toggles. For example, if you have toggles for
"Bold", "Italic", and "Underline", you might label the parent group "Font styles".
