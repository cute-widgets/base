`<cute-divider>` is a component that allows for Bootstrap styling of a line separator with various orientation options.

<!-- example(divider-overview) -->

### Simple divider

A `<cute-divider>` element can be used on its own to create a horizontal or vertical line styled with a Bootstrap theme.

```html
<cute-divider></cute-divider>
```

### Line style

Apply `lineStyle` attribute to change the divider's default style that is **solid**. Other options are
**double**, **dotted**, **dashed**, **shelf**, **blurry**, **washed** and **gradient**.

### Inset divider

Add the `inset` attribute in order to set whether the divider is an inset divider.

```html
<cute-divider [inset]="true"></cute-divider>
```

### Vertical divider

Add the `vertical` attribute in order to set whether the divider is vertically-oriented.

```html
<cute-divider [vertical]="true"></cute-divider>
```


### Lists with inset dividers

Dividers can be added to lists as a means of separating content into distinct sections.
Inset dividers can also be added to provide the appearance of distinct elements in a list without cluttering content
like avatar images or icons. Make sure to avoid adding an inset divider to the last element
in a list, because it will overlap with the section divider.

```html
<cute-list>
   <h3 cute-subheader>Folders</h3>
   @for (folder of folders; track folder) {
      <cute-list-item>
         <cute-icon cute-list-icon>folder</cute-icon>
         <h4 cute-line>{{folder.name}}</h4>
         <p cute-line class="demo-2">{{folder.updated}}</p>
         @if (!$last) {
            <cute-divider [inset]="true"></cute-divider>
         }
      </cute-list-item>
   }
   <cute-divider></cute-divider>
   <h3 cute-subheader>Notes</h3>
   @for (note of notes; track node) {
      <cute-list-item>
         <cute-icon cute-list-icon>note</cute-icon>
         <h4 cute-line>{{note.name}}</h4>
         <p cute-line class="demo-2"> {{note.updated}} </p>
      </cute-list-item>
   }
</cute-list>
```

### Accessibility

`CuteDivider` applies the ARIA `role="separator"` attribute, exclusively implementing the
non-focusable style of separator that distinguishes sections of content.
