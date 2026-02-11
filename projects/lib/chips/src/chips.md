Chips allow users to view information, make selections, filter content, and enter data.

### Static Chips

Chips are always used inside a container. To create chips, start with a `<cute-chip-set>` element. Then,
nest `<cute-chip>` elements inside the `<cute-chip-set>`.

<!-- example(chips-overview) -->

By default, `<cute-chip>` renders a chip with Bootstrap styles applied. For a chip with no styles applied, use `<cute-basic-chip>`.
  
#### Disabled appearance

Although `<cute-chip>` is not interactive, you can set the `disabled` Input to give it disabled appearance.

```html
<cute-chip disabled>Orange</cute-chip>
```

### Selection Chips

Use `<cute-chip-listbox>` and `<cute-chip-option>` for selecting one or many items from a list. Start with creating a `<cute-chip-listbox>` element.
If the user may select more than one option, add the `multiple` attribute. Nest a `<cute-chip-option>` element inside the `<cute-chip-listbox>` for each available option.

#### Disabled `<cute-chip-option>`

Use the `disabled` Input to disable a `<cute-chip-option>`. This gives the `<cute-chip-option>` a disabled appearance and prevents the user from interacting with it.

```html
<cute-chip-option disabled>Orange</cute-chip-option>
```

#### Keyboard Interactions

Users can move through the chips using the arrow keys and select/deselect them with space. Chips also gain focus when clicked, ensuring keyboard navigation starts at the currently focused chip.

### Chips connected to an input field

Use `<cute-chip-grid>` and `<cute-chip-row>` for assisting users with text entry.

Chips are always used inside a container. To create chips connected to an input field, start by creating a `<cute-chip-grid>` as the container.
Add an `<input/>` element, and register it to the `<cute-chip-grid>` by passing the `cuteChipInputFor` Input.
Always use an `<input/>` element with `<cute-chip-grid>`. Nest a `<cute-chip-row>` element inside the `<cute-chip-grid>` for each piece of data entered by the user.
An example of using chips for text input.

<!-- example(chips-input) -->

#### Disabled `<cute-chip-row>`

Use the `disabled` Input to disable a `<cute-chip-row>`. This  gives the `<cute-chip-row>` a disabled appearance and prevents the user from interacting with it.

```html
<cute-chip-row disabled>Orange</cute-chip-row>
```

#### Keyboard Interactions

Users can move through the chips using the arrow keys and select/deselect them with the space. Chips also gain focus when clicked, ensuring keyboard navigation starts at the appropriate chip.

Users can press _Delete_ to remove a chip. Pressing _Delete_ triggers the `removed` Output on the chip, so be sure to implement `removed` if you require that functionality.

#### Autocomplete

An example of chip input with autocomplete.

<!-- example(chips-autocomplete) -->

### Icons
You can add icons to chips to identify entities (like individuals) and provide additional functionality.

#### Adding up to two icons with content projection

You can add two additional icons to an individual chip. A chip has two slots to display icons using content projection. All variants of chips support adding icons including `<cute-chip>`, `<cute-chip-option>`, and `<cute-chip-row>`.

A chip has a front slot for adding an avatar image. To add an avatar, nest an element with `cuteChipAvatar` attribute inside of `<cute-chip>`.

<!-- example(chips-avatar) -->

You can add an additional icon to the back slot by nesting an element with either the `cuteChipTrailingIcon` or `cuteChipRemove` attribute.

#### Remove Button

Sometimes the end user would like the ability to remove a chip. You can provide that functionality using `cuteChipRemove`. `cuteChipRemove` renders to the back slot of a chip and triggers the `removed` Output when clicked.

To create a remove button, nest a `<button>` element with `cuteChipRemove` attribute inside the `<cute-chip-option>`. Be sure to implement the `removed` Output.

```html
 <cute-chip-option>
  Orange
  <button cuteChipRemove aria-label="Remove orange">
    <cute-icon>cancel</cute-icon>
  </button>
</cute-chip-option>
```

See the [accessibility](#accessibility) section for best practices on implementing the `removed` Output and creating accessible icons.

### Orientation

By default, chips are displayed horizontally. To stack chips vertically, apply the `cute-chip-set-stacked` class to `<cute-chip-set>`, `<cute-chip-listbox>` or `<cute-chip-grid>`.

<!-- example(chips-stacked) -->

### Specifying global configuration defaults
Use the `CUTE_CHIPS_DEFAULT_OPTIONS` token to specify default options for the chips module.

```ts
@NgModule({
  providers: [
    {
      provide: CUTE_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [COMMA, SPACE]
      }
    }
  ]
})
```

### Theming

By default, chips use the `primary` color. Specify the `color` property to change the color to others Bootstrap theme colors.

### Interaction Patterns

The chips components support three user interaction patterns, each with its own container and chip elements:

#### Listbox

`<cute-chip-listbox>` and `<cute-chip-option>` : These elements implement a listbox accessibility pattern. Use them to present set of user selectable options.

```html
<cute-chip-listbox aria-label="select a shirt size">
  <cute-chip-option> Small </cute-chip-option>
  <cute-chip-option> Medium </cute-chip-option>
  <cute-chip-option> Large </cute-chip-option>
</cute-chip-listbox>
```

#### Text Entry

`<cute-chip-grid>` and `<cute-chip-row>` : These elements implement a grid accessibility pattern. Use them as part of a free form input that allows users to enter text to add chips.

```html
<cute-form-field>
  <cute-chip-grid #myChipGrid [(ngModel)]="mySelection"
    aria-label="enter sandwich fillings">
    @for (filling of fillings; track filling) {
      <cute-chip-row (removed)="remove(filling)">
        {{filling.name}}
        <button cuteChipRemove>
          <cute-icon>cancel</cute-icon>
        </button>
      </cute-chip-row>
    }
    <input [cuteChipInputFor]="myChipGrid"
           [cuteChipInputSeparatorKeyCodes]="separatorKeysCodes"
           (cuteChipInputTokenEnd)="add($event)" />
  </cute-chip-grid>
</cute-form-field>
```

#### Static Content

`<cute-chip-set>` and `<cute-chip>` as an unordered list : Present a list of items that are not interactive. This interaction pattern mimics using `ul` and `li` elements. Apply role="list" to the `<cute-list>`. Apply role="listitem" to each `<cute-list-item>`.

```html
<cute-chip-set role="list">
  <cute-chip role="listitem"> Sugar </cute-chip>
  <cute-chip role="listitem"> Spice </cute-chip>
  <cute-chip role="listitem"> Everything Nice </cute-chip>
</cute-chip-set>
```

`<cute-chip-set>` and `<cute-chip>` : These elements do not implement any specific accessibility pattern. Add the appropriate accessibility depending on the context.
Note that **CuteWidgets** does not intend `<cute-chip>`, `<cute-basic-chip>`, and `<cute-chip-set>` to be interactive.

```html
<cute-chip-set>
  <cute-chip> John </cute-chip>
  <cute-chip> Paul </cute-chip>
  <cute-chip> James </cute-chip>
</cute-chip-set>
```

### Accessibility

The [Interaction Patterns](#interaction-patterns) section describes the three variants of chips available. Choose the chip variant that best matches your use case.

For both `CuteChipGrid` and `CuteChipListbox`, always apply an accessible label to the control via `aria-label` or `aria-labelledby`.

Always apply `CuteChipRemove` to a `<button>` element, never a `<cute-icon>` element.

When using `CuteChipListbox`, never nest other interactive controls inside of the `<cute-chip-option>` element. Nesting controls degrades the experience for assistive technology users.

By default, `CuteChipListbox` displays a checkmark to identify selected items. While you can hide the checkmark indicator for single-selection via `hideSingleSelectionIndicator`, this makes the component less accessible by making it harder or impossible for users to visually identify selected items.

When a chip is editable, provide instructions to assistive technology how to edit the chip using a keyboard. One way to achieve this is adding an `aria-description` attribute with instructions to press `Enter` to edit the chip.
