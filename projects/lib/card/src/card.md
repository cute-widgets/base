`<cute-card>` is a content container for text, photos, and actions in the context of a single subject.

<!-- example(card-overview) -->

### Basic card sections

The most basic card needs only an `<cute-card>` element with some content. However, `CuteWidgets`
provides a number of preset sections that you can use inside a `<cute-card>`:

| Element                 | Description                                                    |
|-------------------------|----------------------------------------------------------------|
| `<cute-card-header>`    | Section anchored to the top of the card (adds padding)         |
| `<cute-card-content>`   | Primary card content (adds padding)                            |
| `<img cute-card-image>` | Card image. Stretches the image to the container width         |
| `<cute-card-actions>`   | Container for buttons at the bottom of the card (adds padding) |
| `<cute-card-footer>`    | Section anchored to the bottom of the card                     |

These elements primary serve as pre-styled content containers without any additional APIs.
However, the `align` property on `<cute-card-actions>` can be used to position the actions at the
`'start'` or `'end'` of the container.

### Card padding

The `<cute-card>` element itself does not add any padding around its content. This allows developers
to customize the padding to their liking by applying padding to the elements they put in the card.

In many cases developers may just want the standard padding specified in the Bootstrap Design spec.
In this case, the `<cute-card-header>`, `<cute-card-content>`, and `<cute-card-footer>` sections can be
used.

* `<cute-card-content>` adds standard padding along its sides, as well as along the top if it is the
  first element in the `<cute-card>`, and along the bottom if it is the last element in the
  `<cute-card>`.
* `<cute-card-header>` adds standard padding along its sides and top.
* `<cute-card-actions>` adds padding appropriate for the action buttons at the bottom of a card.

### Card headers

A `<cute-card-header>` can contain any content, but there are several predefined elements
that can be used to create a rich header to a card. These include:

| Element                  | Description                                          |
|--------------------------|------------------------------------------------------|
| `<cute-card-title>`      | A title within the header                            |
| `<cute-card-subtitle>`   | A subtitle within the header                         |
| `<img cute-card-avatar>` | An image used as an avatar within the header         |

In addition to using `<cute-card-title>` and `<cute-card-subtitle>` directly within the
`<cute-card-header>`, they can be further nested inside a `<cute-card-title-group>` in order arrange
them with a (non-avatar) image.

### Title groups

`<cute-card-title-group>` can be used to combine a title, subtitle, and image into a single section.
This element can contain:
* `<cute-card-title>`
* `<cute-card-subtitle>`
* One of:
  * `<img cute-card-sm-image>`
  * `<img cute-card-md-image>`
  * `<img cute-card-lg-image>`

### Card layout
In addition to styling the content within cards, Bootstrap includes a few options for laying out series of cards.

### Card groups
Use card groups to render cards as a single, attached element with equal width and height columns. 
Card groups start off stacked and use `display: flex;` to become attached with uniform dimensions 
starting at the `sm` breakpoint. 
When using card groups with footers, their content will automatically line up.

### Grid cards
Use the Bootstrap grid system and its `.row-cols` classes to control how many grid columns (wrapped around your cards) you show per row. 
For example, `.row-cols-1` laying out the cards on one column, and `.row-cols-md-2` splitting four cards to 
equal width across multiple rows, from the medium breakpoint up. When you need equal height, add `.h-100` to the cards. 
Just like with card groups, card footers will automatically line up.

### Accessibility

Cards serve a wide variety of scenarios and may contain many different types of content.
Due to this flexible nature, the appropriate accessibility treatment depends on how you use
`<cute-card>`.

#### Group, region, and landmarks

There are several ARIA roles that communicate that a portion of the UI represents some semantically
meaningful whole. Depending on what the content of the card means to your application, you can apply
one of [`role="group"`][role-group], [`role="region"`][role-region], or
[one of the landmark roles][aria-landmarks] to the `<cute-card>` element.

You do not need to apply a role when using a card as a purely decorative container that does not
convey a meaningful grouping of related content for a single subject. In these cases, the content
of the card should follow standard practices for document content.

#### Focus

Depending on how cards are used, it may be appropriate to apply a `tabindex` to the `<cute-card>`
element.

* If cards are a primary mechanism through which user interacts with the application, `tabindex="0"`
  may be appropriate.
* If attention can be sent to the card, but it's not part of the document flow, `tabindex="-1"` may
  be appropriate.
* If the card acts as a purely decorative container, it does not need to be tabbable. In this case,
  the card content should follow normal best practices for tab order.

Always test your application to verify the behavior that works best for your users.

[role-group]: https://www.w3.org/TR/wai-aria/#group
[role-region]: https://www.w3.org/TR/wai-aria/#region
[aria-landmarks]: https://www.w3.org/TR/wai-aria/#landmark
