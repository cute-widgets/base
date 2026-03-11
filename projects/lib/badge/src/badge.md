Badges are small count and labeling components that scale to match the size of the immediate parent element by using relative font sizing and `em` units. 
Badges have no focus or hover styles for links.

### Positioned

Use `position` property to place the badge in the corner of a parent link or button.

### Styling
For proper styling, use the `color` input property. The `roundedPill` property makes a badge more rounded with a larger border-radius.

### Example
```html
<button cuteButton="flat-button" color="primary" style="width: 9rem">
  Notifications
  <cute-badge color="danger" roundedPill>5</cute-badge>
</button>
```
