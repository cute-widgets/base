/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Bootstrap media queries, or `breakpoints`.
 */
export const bsBreakpoints = {

  query: {
    SmallAndDown: '(max-width: 575.98px)',
    MediumAndDown: '(max-width: 767.98px)',
    LargeAndDown: '(max-width: 991.98px)',
    XLargeAndDown: '(max-width: 1199.98px)',
    XXLargeAndDown: '(max-width: 1399.98px)',

    XSmall: '(max-width: 575.98px)',
    Small:  '(min-width: 576px) and (max-width: 767.98px)',
    Medium: '(min-width: 768px) and (max-width: 991.98px)',
    Large:  '(min-width: 992px) and (max-width: 1199.98px)',
    XLarge: '(min-width: 1200px) and (max-width: 1399.98px)',
    XXLarge: '(min-width: 1400px)',

    get xs(): string {return this.XSmall},
    get sm(): string {return this.Small},
    get md(): string {return this.Medium},
    get lg(): string {return this.Large},
    get xl(): string {return this.XLarge},
    get xxl(): string {return this.XXLarge},
  },

  get grid(): {xs:number,sm:number,md:number,lg:number,xl:number,xxl:number} {
    return {xs:0, sm:576, md:768, lg: 992, xl: 1200, xxl: 1400};
  },

  /**
   * Gets the object's property name of the media-query by its value
   * @param query The media-query text
   * @returns The property name of the media-query or _undefined_ if it was not found
   */
  getQueryName(query: string): string | undefined {
    let res: string | undefined;
    if (query) {
      for (const key in this) {
        if ((this as any)[key] === query) {
          res = key;
          break;
        }
      }
    }
    return res;
  },
  /**
   * Gets the breakpoint label by Bootstrap's breakpoint abbreviation
   * @param code Bootstrap's breakpoint abbreviation.
   * @returns More descriptive text of the abbreviation.
   */
  getLabel(code: string): string {
    switch (code.trim().toLowerCase()) {
      case "xs":
      case "xsmall":
        return "XSmall";
      case "sm":
      case "small":
        return "Small";
      case "md":
      case "medium":
        return "Medium";
      case "lg":
      case "large":
        return "Large";
      case "xl":
      case "xlarge":
        return "XLarge";
      case "xxl":
      case "xxlarge":
        return "XXLarge";
    }
    return "";
  },

  /**
   * Returns the media query string for the specified breakpoint symbol.
   * @param code Bootstrap's breakpoint abbreviation.
   * @returns Media query string or _undefined_ if the code has an unknown value.
   */
  getQuery(code: string): string | undefined {
    if (code in this.query) {
      return (this.query as any)[code];
    }
    return undefined;
  }
}
