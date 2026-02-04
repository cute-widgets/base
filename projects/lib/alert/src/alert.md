Alerts provide contextual feedback messages for typical user actions. Alerts are available for any 
length of text, as well as an optional close button. For proper styling, use the `color` input property. 
For inline dismissal, use the `dismissible` property and optionally `duration` for set the time period in 
milliseconds after which the alert message is automatically dismissed.

### Additional content
Alerts can also contain additional HTML elements like headings, paragraphs and dividers.
You can cse `cuteAlertHeading` directive for header styling and `cute-divider` component as
a horizontal or vertical divider.

### Accessibility
Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies
like screen readers. Please ensure the meaning is obvious from the content itself (e.g., the visible text with a 
sufficient color contrast) or is included through alternative means, such as additional text hidden with the 
`.visually-hidden` class.
