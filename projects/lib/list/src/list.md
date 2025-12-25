`<cute-list>` is a container component that wraps and formats a series of `<cute-list-item>`. As the
base list component, it provides Bootstrap styling but no behavior of its own.

```html
<cute-list role="list">
  <cute-list-item role="listitem">Item 1</cute-list-item>
  <cute-list-item role="listitem">Item 2</cute-list-item>
  <cute-list-item role="listitem">Item 3</cute-list-item>
</cute-list>
```

List items can be constructed in two ways depending on the content they need to show:

### Simple lists

If a list item needs to show a single line of textual information, the text can be inserted
directly into the `<cute-list-item>` element.

```html
<cute-list>
 <cute-list-item>Pepper</cute-list-item>
 <cute-list-item>Salt</cute-list-item>
 <cute-list-item>Paprika</cute-list-item>
</cute-list>
```

### Multi-line lists

List items that have more than one line of text have to use the `cuteListItemTitle` directive to
indicate their title text for accessibility purposes, in addition to the `cuteListItemLine` directive
for each subsequent line of text.

```html
<cute-list>
  <cute-list-item>
    <span cuteListItemTitle>Pepper</span>
    <span cuteListItemLine>Produced by a plant</span>
  </cute-list-item>
  <cute-list-item>
    <span cuteListItemTitle>Salt</span>
    <span cuteListItemLine>Extracted from sea water</span>
  </cute-list-item>
  <cute-list-item>
    <span cuteListItemTitle>Paprika</span>
    <span cuteListItemLine>Produced by dried and ground red peppers</span>
  </cute-list-item>
</cute-list>
```

To activate text wrapping, the `lines` input has to be set on the `<cute-list-item>` indicating the
number of lines of text.

The following directives can be used to style the content of a list item:

| Directive           | Description                                                                |
|---------------------|----------------------------------------------------------------------------|
| `cuteListItemTitle`  | Indicates the title of the list item. Required for multi-line list items.  |
| `cuteListItemLine`   | Wraps a line of text within a list item.                                   |
| `cuteListItemIcon`   | Icon typically placed at the beginning of a list item.                     |
| `cuteListItemAvatar` | Image typically placed at the beginning of a list item.                    |
| `cuteListItemMeta`   | Inserts content in the meta section at the end of a list item.             |

### Navigation lists

Use `cute-nav-list` tags for navigation lists (i.e., lists that have anchor tags).

Simple navigation lists can use the `cute-list-item` attribute on anchor tag elements directly:

```html
<cute-nav-list>
  @for (link of list; track link) {
    <a cute-list-item href="..." [activated]="link.isActive">{{ link }}</a>
  }
</cute-nav-list>
```

For more complex navigation lists (e.g., with more than one target per item), wrap the anchor
element in an `<cute-list-item>`.

```html
<cute-nav-list>
  @for (link of links; track link) {
    <cute-list-item [activated]="link.isActive">
       <a cuteListItemTitle href="...">{{ link }}</a>
       <button cuteButton="icon-button" (click)="showInfo(link)" cuteListItemMeta>
          <cute-icon>info</cute-icon>
       </button>
    </cute-list-item>
  }
</cute-nav-list>
```

### Action lists

Use the `<cute-action-list>` element when each item in the list performs some _action_. Each item
in an action list is a `<button>` element.

Simple action lists can use the `cute-list-item` attribute on button tag elements directly:

```html
<cute-action-list>
  <button cute-list-item (click)="save()">Save</button>
  <button cute-list-item (click)="undo()">Undo</button>
</cute-action-list>
```

### Selection lists
A selection list provides an interface for selecting values, where each list item is an option.

```html
<cute-selection-list #shoes>
  @for (shoe of typesOfShoes; track shoe) {
    <cute-list-option>{{shoe}}</cute-list-option>
  }
</cute-selection-list>

<p>
  Options selected: {{shoes.selectedOptions.selected.length}}
</p>
```

The options within a selection-list should not contain further interactive controls, such
as buttons and anchors.


### Multi-line lists
For lists that require multiple lines per item, annotate each line with an `cuteListItemLine`
attribute. Whichever heading tag is appropriate for your DOM hierarchy should be used
(not necessarily `<h3>` as shown in the example).

```html
<!-- two-line list -->
<cute-list>
  @for (message of messages; track message) {
    <cute-list-item>
      <h3 cuteListItemTitle>{{message.from}}</h3>
      <p cuteListItemLine>
        <span>{{message.subject}}</span>
        <span class="demo-2"> -- {{message.content}}</span>
      </p>
    </cute-list-item>
  }
</cute-list>

<!-- three-line list -->
<cute-list>
  @for (message of messages; track message) {
    <cute-list-item>
      <h3 cuteListItemTitle>{{message.from}}</h3>
      <p cuteListItemLine>{{message.subject}}</p>
      <p cuteListItemLine class="demo-2">{{message.content}}</p>
    </cute-list-item>
  }
</cute-list>
```

### Lists with icons

To add an icon to your list item, use the `cuteListItemIcon` attribute.

```html
<cute-list>
  @for (message of messages; track message) {
    <cute-list-item>
      <cute-icon cuteListItemIcon>folder</cute-icon>
      <h3 cuteListItemTitle>{{message.from}}</h3>
      <p cuteListItemLine>
        <span>{{message.subject}}</span>
        <span class="demo-2"> -- {{message.content}}</span>
      </p>
    </cute-list-item>
  }
</cute-list>
```

### Lists with avatars

To include an avatar image, add an image tag with an `cuteListItemAvatar` attribute.

```html
<cute-list>
  @for (message of messages; track message) {
    <cute-list-item>
      <img cuteListItemAvatar src="..." alt="...">
      <h3 cuteListItemTitle>{{message.from}}</h3>
      <p cuteListItemLine>
        <span>{{message.subject}}</span>
        <span class="demo-2"> -- {{message.content}}</span>
      </p>
    </cute-list-item>
  }
</cute-list>
```

### Lists with multiple sections

Subheaders can be added to a list by annotating a heading tag with an `cuteSubheader` attribute.
To add a divider, use `<cute-divider>`.

```html
<cute-list>
   <h3 cuteSubheader>Folders</h3>
   @for (folder of folders; track folder) {
     <cute-list-item>
        <cute-icon cuteListItemIcon>folder</cute-icon>
        <h4 cuteListItemTitle>{{folder.name}}</h4>
        <p cuteListItemLine class="demo-2"> {{folder.updated}} </p>
     </cute-list-item>
   }
   <cute-divider></cute-divider>
   <h3 cuteSubheader>Notes</h3>
   @for (note of notes; track note) {
     <cute-list-item>
        <cute-icon cuteListItemIcon>note</cute-icon>
        <h4 cuteListItemTitle>{{note.name}}</h4>
        <p cuteListItemLine class="demo-2"> {{note.updated}} </p>
     </cute-list-item>
   }
</cute-list>
```

### Accessibility

CuteWidgets offers multiple varieties of a list so that you can choose the type that best applies
to your use-case.

#### Navigation

You should use `CuteNavList` when every item in the list is an anchor that navigate to another URL.
The root `<cute-nav-list>` element sets `role="navigation"` and should contain only anchor elements
with the `cute-list-item` attribute. You should not nest any interactive elements inside these
anchors, including buttons and checkboxes.

Always provide an accessible label for the `<cute-nav-list>` element via `aria-label` or
`aria-labelledby`.

#### Selection

You should use `CuteSelectionList` and `CuteListOption` for lists that allow the user to select one
or more values. This list variant uses the `role="listbox"` interaction pattern, handling all
associated keyboard input and focus management. You should not nest any interactive elements inside
these options, including buttons and anchors.

Always provide an accessible label for the `<cute-selection-list>` element via `aria-label` or
`aria-labelledby` that describes the selection being made.

By default, `CuteSelectionList` displays radio or checkmark indicators to identify selected items.
While you can hide the radio indicator for single-selection via `hideSingleSelectionIndicator`, this
makes the component less accessible by making it harder or impossible for users to visually identify
selected items.

#### Custom scenarios

By default, the list assumes that it will be used in a purely decorative fashion and thus it sets no
roles, ARIA attributes, or keyboard shortcuts. This is equivalent to having a sequence of `<div>`
elements on the page. Any interactive content within the list should be given an appropriate
accessibility treatment based on the specific workflow of your application.

If the list is used to present a list of non-interactive content items, then the list element should
be given `role="list"` and each list item should be given `role="listitem"`.
