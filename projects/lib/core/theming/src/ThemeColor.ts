/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * `CuteWidgets` supports standard Bootstrap 5 theme colors - `ThemeColor` type. But to account
 * miscellaneous use cases of usage this colors in components CuteWidgets add extended definition of
 * latter - `RichThemeColor`. Rich color is the standard color name plus "-emphasis" or "-contrast" suffix at the end.
 * Depending on the context of applying color, the result CSS-class can be `.text-*`, `.text-bg-*` or ended with
 * `-emphasis` or `-subtle` suffixes.
 */
import {Directive, InjectionToken, Input, input} from "@angular/core";

/** Bootstrap theme colors */
const Palette = ["primary","secondary","success","danger","warning","info","light","dark","link","tertiary"] as const;

/** Bootstrap’s base color palette. */
export type ThemeColor = typeof Palette[number];
/** Rich color palette is based on the standard Bootstrap palette but has additional shades. */
export type RichThemeColor = ThemeColor | `${ThemeColor}-emphasis` | `${ThemeColor}-contrast`;

/** Alias for `ThemeColor` type. */
export type ThemePalette = ThemeColor;
/** Alias for `ThemeColor` type. */
export type RichThemePalette = RichThemeColor;

/**
 * Whether a string is a valid theme color name
 * @param str Text case-sensitive value
 * @returns _true_ if `str` is a valid color name, otherwise _false_
 */
export function isThemeColor(str: string|undefined|null): str is ThemeColor {
  if (str) {
    return Palette.indexOf(str as any) !== -1;
  }
  return false;
}

/**
 * Whether a string is a valid rich or base theme color name.
 * @param str Case-sensitive text value of the color name.
 * @returns _true_ if `str` is a valid rich color name, otherwise _false_.
 */
export function isRichThemeColor(str: string|undefined|null): str is RichThemeColor {
  if (str) {
    if (isExtendedColor(str)) {
      str = getBaseColor(str as RichThemeColor);
    }
    return isThemeColor(str);
  }
  return false;
}

/**
 * Transforms a string to `ThemeColor` type.
 * @param color Color value to transform
 * @returns _ThemeColor_'s value or _undefined_, if the `color` has an invalid value.
 */
export function toThemeColor(color: string|undefined|null): ThemeColor|undefined {
  if (typeof color==="string") {
    color = color.trim().toLowerCase();
    if (isExtendedColor(color)) {
      color = getBaseColor(color as RichThemeColor);
    }
    if (isThemeColor(color)) {
      return color;
    }
  }
  return undefined;
}

/**
 * To `_RichThemeColor_` transformer function.
 * @param color Color value to transform into rich color type.
 * @returns _RichThemeColor_ value or _undefined_ if `color` is invalid.
 */
export function toRichThemeColor(color: string|undefined|null): RichThemeColor|undefined {
  if (typeof color==="string") {
    color = color.trim().toLowerCase();
    if (isRichThemeColor(color)) {
      return color;
    }
  }
  return undefined;
}

/**
 * Returns a valid Bootstrap's `.text-*` CSS class.
 * @param color Color palette to transform into CSS-class.
 */
export function toTextCssClass(color: string|undefined|null): string {
  const richThemeColor: RichThemeColor|undefined = toRichThemeColor(color);
  if (richThemeColor) {
    if (richThemeColor.startsWith("tertiary")) {
      // Bootstrap 5 has no ".text-tertiary-*" classes, so we return following
      return "text-body-tertiary";
    }

    let themeColor: ThemeColor;
    if (isExtendedColor(richThemeColor)) {
      themeColor = getBaseColor(richThemeColor);
      if (richThemeColor.endsWith("-emphasis")) {
        return `text-${themeColor}-emphasis`;
      }
      // contrast
      return `text-bg-${themeColor}`;
    }
    themeColor = richThemeColor as ThemeColor;
    return `text-${themeColor}`;
  }
  return "";
}

/**
 * Returns a valid Bootstrap's `.bg-*` or `.text-bg-*` CSS class name.
 * @param color Value to transform into CSS-class.
 */
export function toBgCssClass(color: string|undefined|null): string {
  const richThemeColor: RichThemeColor|undefined = toRichThemeColor(color);
  if (richThemeColor) {
    if (richThemeColor.startsWith("tertiary")) {
      // Bootstrap 5 has no 'tertiary-subtle'/'bg-tertiary' classes, so we return following
      return "bg-body-tertiary";
    }

    let themeColor: ThemeColor;
    if (isExtendedColor(richThemeColor)) {
      themeColor = getBaseColor(richThemeColor);
      if (richThemeColor.endsWith("-emphasis")) {
        return `bg-${themeColor}-subtle`;
      }
      // contrast
      return `text-bg-${themeColor}`;
    }

    themeColor = richThemeColor as ThemeColor;
    // Simple background
    return `bg-${themeColor}`;
  }
  return "";
}

/**
 * Set a background color with contrasting foreground color.
 * @param color Color palette to transform into CSS-class.
 * @returns A valid Bootstrap's `.text-bg-*` CSS-class
 */
export function toTextBgCssClass(color: string|undefined|null): string {
  const richThemeColor: RichThemeColor|undefined = toRichThemeColor(color);
  if (richThemeColor) {
    if (richThemeColor.startsWith("tertiary")) {
      return "text-body-tertiary";
    }
    let themeColor: ThemeColor;
    if (isExtendedColor(richThemeColor)) {
      themeColor = getBaseColor(richThemeColor);
    } else {
      themeColor = richThemeColor as ThemeColor;
    }
    return "text-bg-"+themeColor;
  }
  return "";
}

/**
 * Returns a valid Bootstrap's `.text-*` or `.text-bg-*` CSS class.
 * @param color Color value to transform into CSS-class.
 */
export function toColorCssClass(color: string|undefined|null): string {
  if (color) {
    if (color.endsWith("-contrast")) {
      return toTextBgCssClass(color);
    }
    return toTextCssClass(color);
  }
  return "";
}

/**
 * Extracts `ThemeColor` from the `RichThemeColor`.
 * @param color Rich color
 * @returns Base theme color.
 * @internal
 */
function getBaseColor(color: RichThemeColor): ThemeColor {
  let dashPos = color.indexOf("-");
  if (dashPos >= 0) {
    return color.slice(0, dashPos) as ThemeColor;
  }
  return color as ThemeColor;
}

/** Whether the specified color is extended counterpart of the standard palette color. */
function isExtendedColor(color: string): boolean {
  return color.endsWith("-emphasis") || color.endsWith("-contrast");
}


export const CUTE_THEME_COLOR = new InjectionToken<CuteThemeColor>("CUTE_THEME_COLOR");

@Directive({
  selector: '[cuteThemeColor]',
  exportAs: 'cuteThemeColor',
  host: {},
  providers: [{provide: CUTE_THEME_COLOR, useExisting: CuteThemeColor}],
})
export class CuteThemeColor /* extends ... */ {

  @Input("cuteThemeColor")
  color: RichThemeColor | undefined;

  colorClass(): string {
    return toColorCssClass(this.color);
  }

  bgClass(): string {
    return toBgCssClass(this.color);
  }

  textBgClass(): string {
    return toTextBgCssClass(this.color);
  }

}
