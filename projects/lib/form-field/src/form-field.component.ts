/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */
import {
  AfterContentChecked, afterEveryRender,
  ChangeDetectionStrategy,
  Component, computed, contentChild, ContentChild, ContentChildren, ElementRef, inject,
  InjectionToken, Injector, Input, isDevMode, NgZone, QueryList, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";
import {Direction, Directionality} from "@angular/cdk/bidi";
import {Platform} from "@angular/cdk/platform";
import {AbstractControlDirective, ValidatorFn} from "@angular/forms";
import {RelativeSize3, ThemeColor} from "@cute-widgets/base/core";
import {EMPTY, merge, pairwise, Subject, Subscription} from "rxjs";
import {filter, map, startWith, takeUntil} from "rxjs/operators";
import {CuteFormFieldControl as _CuteFormFieldControl} from "./form-field-control";
import {CUTE_PREFIX, CutePrefix} from "./directives/prefix.directive";
import {CUTE_SUFFIX, CuteSuffix} from "./directives/suffix.directive";
import {CUTE_ERROR, CuteError} from "./directives/error.directive";
import {CuteHint} from "./directives/hint.directive";
import {getCuteFormFieldDuplicatedHintError, getCuteFormFieldMissingControlError} from "./form-field-errors";
import {CuteLabel} from "./directives/label.directive";
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {BooleanInput, coerceBooleanProperty} from "@angular/cdk/coercion";
import {_animationsDisabled} from '@cute-widgets/base/core/animation';

/** Type for the available floatLabel values. */
export type FloatLabelType = 'never' | 'always' | 'auto';

/** Behaviors for how the subscript height is set. */
export type SubscriptSizing = 'fixed' | 'dynamic';

/**
 * Represents the default options for the form field that can be configured
 * using the `CUTE_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
export interface CuteFormFieldDefaultOptions {
  /** Default form field appearance style. */
  //appearance?: CuteFormFieldAppearance;
  /** Default color of the form field. */
  color?: ThemeColor;
  /** Whether the required marker should be hidden by default. */
  hideRequiredMarker?: boolean;
  /** Whether the label for form fields should by default float */
  floatLabel?: FloatLabelType;
  /** Whether the form field should reserve space for one line by default. */
  subscriptSizing?: SubscriptSizing;
}

/**
 * Injection token that can be used to inject an instances of `CuteFormField`. It serves
 * as an alternative token to the actual `CuteFormField` class which would cause unnecessary
 * retention of the `CuteFormField` class and its component metadata.
 */
export const CUTE_FORM_FIELD = new InjectionToken<CuteFormField>('CuteFormField');

/**
 * Injection token that can be used to configure the
 * default options for all form fields within an app.
 */
export const CUTE_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken<CuteFormFieldDefaultOptions>(
    'CUTE_FORM_FIELD_DEFAULT_OPTIONS',
);

/** Styles that are to be applied to the label elements in the outlined appearance. */
type OutlinedLabelStyles =
  | [floatingLabelTransform: string, notchedOutlineWidth: number | null]
  | null;

/**
 * Whether the label for form fields should by default float `always`,
 * `never`, or `auto`.
 */
const DEFAULT_FLOAT_LABEL: FloatLabelType = 'never';

/** Default way that the subscript element height is set. */
const DEFAULT_SUBSCRIPT_SIZING: SubscriptSizing = 'fixed';

/**
 * Despite `CuteFormFieldControl` being an abstract class, most of our usages enforce its shape
 * using `implements` instead of `extends`. This appears to be problematic when Closure compiler
 * is configured to use type information to rename properties, because it can't figure out which
 * class properties are coming from. This interface seems to work around the issue while preserving
 * our type safety (instead being using `any` everywhere).
 * @docs-private
 */
interface CuteFormFieldControl<T> extends _CuteFormFieldControl<T> {}

let nextUniqueId = 0;

@Component({
    selector: 'cute-form-field',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss'],
    exportAs: 'cuteFormField',
    host: {
        'class': 'cute-form-field',
        '[class.cute-form-field-label-always-float]': '_shouldAlwaysFloat()',
        '[class.cute-form-field-invalid]': '_control?.errorState',
        '[class.cute-form-field-disabled]': '_control?.disabled',
        '[class.cute-form-field-autofilled]': '_control?.autofilled',
        '[class.ng-untouched]': '_shouldForward("untouched")',
        '[class.ng-touched]': '_shouldForward("touched")',
        '[class.ng-pristine]': '_shouldForward("pristine")',
        '[class.ng-dirty]': '_shouldForward("dirty")',
        '[class.ng-valid]': '_shouldForward("valid")',
        '[class.ng-invalid]': '_shouldForward("invalid")',
        '[class.ng-pending]': '_shouldForward("pending")',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: CUTE_FORM_FIELD, useExisting: CuteFormField },
    ],
    imports: [
        NgTemplateOutlet,
        CuteHint
    ]
})
export class CuteFormField extends CuteBaseControl implements AfterContentChecked {
  override _elementRef = inject(ElementRef);
  private _dir = inject(Directionality);
  private _platform = inject(Platform);
  private _ngZone = inject(NgZone);
  private _defaults = inject<CuteFormFieldDefaultOptions>(CUTE_FORM_FIELD_DEFAULT_OPTIONS, {
    optional: true,
  });
  private _currentDirection: Direction | undefined;

  @ViewChild('textField')   _textField: ElementRef<HTMLElement> | undefined;
  //@ViewChild('iconPrefixContainer') _iconPrefixContainer: ElementRef<HTMLElement> | undefined;
  //@ViewChild('textPrefixContainer') _textPrefixContainer: ElementRef<HTMLElement> | undefined;
  //@ViewChild('iconSuffixContainer') _iconSuffixContainer: ElementRef<HTMLElement> | undefined;
  //@ViewChild('textSuffixContainer') _textSuffixContainer: ElementRef<HTMLElement> | undefined;

  @ContentChild(CuteLabel) _labelChildNonStatic: CuteLabel | undefined;
  @ContentChild(CuteLabel, {static: true}) _labelChildStatic: CuteLabel | undefined;
  @ContentChild(_CuteFormFieldControl) _formFieldControl: CuteFormFieldControl<any> | undefined;
  @ContentChildren(CUTE_PREFIX, {descendants: true}) _prefixChildren: QueryList<CutePrefix> | undefined;
  @ContentChildren(CUTE_SUFFIX, {descendants: true}) _suffixChildren: QueryList<CuteSuffix> | undefined;
  @ContentChildren(CUTE_ERROR, {descendants: true}) _errorChildren: QueryList<CuteError> | undefined;
  @ContentChildren(CuteHint, {descendants: true}) _hintChildren: QueryList<CuteHint> | undefined;

  private readonly _labelChild = contentChild(CuteLabel);

  /** Whether to display the CSS styles for a _valid_ control status after it has been checked. */
  @Input()
  get hideValidStyle():boolean { return this._hideValidStyle; }
  set hideValidStyle(hideValid: BooleanInput) {
    this._hideValidStyle = coerceBooleanProperty(hideValid);
    this.displayValidity(!this._hideValidStyle);
  }
  private _hideValidStyle: boolean = false;

  /** Whether the required marker should be hidden. */
  @Input()
  get hideRequiredMarker(): boolean { return this._hideRequiredMarker; }
  set hideRequiredMarker(value: BooleanInput) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  private _hideRequiredMarker = false;

  /** The relative size of the form field */
  @Input()
  magnitude: RelativeSize3 | undefined;

  /** Whether the label should always float or float as the user types. */
  @Input()
  get floatLabel(): FloatLabelType {
    return this._floatLabel || this._defaults?.floatLabel || DEFAULT_FLOAT_LABEL;
  }
  set floatLabel(value: FloatLabelType) {
    if (value !== this._floatLabel) {
      this._floatLabel = value;
      // For backwards compatibility. Custom form field controls or directives might set
      // the "floatLabel" input and expect the form field view to be updated automatically.
      // e.g. autocomplete trigger. Ideally we'd get rid of this and the consumers would just
      // emit the "stateChanges" observable. TODO(devversion): consider removing.
      this.markForCheck();
    }
  }
  private _floatLabel: FloatLabelType = "never";

  /**
   * Whether the form field should reserve space for one line of hint/error text (default)
   * or to have the spacing grow from 0px as needed based on the size of the hint/error content.
   * Note that when using dynamic sizing, layout shifts will occur when hint/error text changes.
   */
  @Input()
  get subscriptSizing(): SubscriptSizing {
    return this._subscriptSizing || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  set subscriptSizing(value: SubscriptSizing) {
    this._subscriptSizing = value || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  private _subscriptSizing: SubscriptSizing | null = null;

  /** Text for the form field hint. */
  @Input()
  get hintLabel(): string { return this._hintLabel; }
  set hintLabel(value: string) {
    this._hintLabel = value;
    this._processHints();
  }
  private _hintLabel = '';

  protected _hasIconPrefix = false;
  protected _hasTextPrefix = false;
  protected _hasIconSuffix = false;
  protected _hasTextSuffix = false;

  // Unique id for the internal form field label.
  readonly _labelId = `cute-form-field-label-${nextUniqueId++}`;

  // Unique id for the hint label.
  readonly _hintLabelId = `cute-hint-${nextUniqueId++}`;

// Ids obtained from the error and hint fields
  private _describedByIds: string[] | undefined;

  /** Gets the current form field control */
  get _control(): CuteFormFieldControl<any> | undefined {
    return this._explicitFormFieldControl || this._formFieldControl;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  private _explicitFormFieldControl: CuteFormFieldControl<any> | undefined;

  /** Subject that emits when the component has been destroyed. */
  private _destroyed = new Subject<void>();
  private _isFocused: boolean | null = null;
  private _needsOutlineLabelOffsetUpdate = false;
  private _previousControl: CuteFormFieldControl<any> | undefined = undefined;
  private _previousControlValidatorFn: ValidatorFn | null = null;
  private _stateChanges: Subscription | undefined;
  private _valueChanges: Subscription | undefined;
  private _describedByChanges: Subscription | undefined;
  protected readonly _animationsDisabled = _animationsDisabled();

  private _injector = inject(Injector);

  /** Returns bootstrap's size suffix for CSS classes */
  protected get magnitudeSuffix(): string {
    if (this.magnitude == "small") {
      return "-sm";
    } else if (this.magnitude == "large") {
      return "-lg";
    }
    return "";
  }

  public get _isFloatLabel(): boolean {
    return this.floatLabel == "auto" || this.floatLabel == "always";
  }

  protected override generateId(): string {
    return "";
  }

  constructor(...args: unknown[]);
  constructor() {
    super();
    const defaults = this._defaults;
    if (defaults) {
      //if (_defaults.appearance) {
      //  this.appearance = _defaults.appearance;
      //}
      this.hideRequiredMarker = Boolean(defaults?.hideRequiredMarker);
      if (defaults.color) {
        this.color = defaults.color;
      }
    }
  }

  protected override setDisabledState(newState: BooleanInput, emitEvent?: boolean): boolean {
    this._control?.setDisabledState( coerceBooleanProperty(newState) );
    return super.setDisabledState(newState, emitEvent);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    // Initial focus state sync. This happens rarely, but we want to account for
    // it in case the form field control has "focused" set to true on init.
    this._updateFocusState();

    if (!this._animationsDisabled) {
      this._ngZone.runOutsideAngular(() => {
        // Enable animations after a certain amount of time so that they don't run on init.
        setTimeout(() => {
          this._elementRef.nativeElement.classList.add('cute-form-field-animations-enabled');
        }, 300);
      });
    }
    // Because the above changes a value used in the template after it was checked, we need
    // to trigger CD or the change might not be reflected if there is no other CD scheduled.
    this._changeDetectorRef.detectChanges();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    this._assertFormFieldControl();
    this._initializeSubscript();
    this._initializePrefixAndSuffix();
    this._initializeOutlineLabelOffsetSubscriptions();

    // CWT: Set `magnitude` value of the component to the child's `label` control as a default value
    const childLabel = this._labelChildNonStatic || this._labelChildStatic;
    if (childLabel && !childLabel.magnitude) {
      childLabel.magnitude = this.magnitude;
    }
  }

  ngAfterContentChecked() {
    this._assertFormFieldControl();

    if (this._control !== this._previousControl) {
      this._initializeControl(this._previousControl);

      // keep a reference for last validator we had.
      if (this._control?.ngControl && this._control.ngControl.control) {
        this._previousControlValidatorFn = this._control.ngControl.control.validator;
      }

      this._previousControl = this._control;
    }

    // make sure the control has been initialized.
    if (this._control?.ngControl && this._control.ngControl.control) {
      // get the validators for current control.
      const validatorFn = this._control.ngControl.control.validator;

      // if our current validatorFn isn't equal to it might be we are CD behind, marking the
      // component will allow us to catch up.
      if (validatorFn !== this._previousControlValidatorFn) {
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._stateChanges?.unsubscribe();
    this._valueChanges?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId = computed(() => (this._hasFloatingLabel() ? this._labelId : null));

  /**
   * Gets an ElementRef for the element that an overlay attached to the form field
   * should be positioned relative to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    //return this._control?.controlElementRef || this._textField || this._elementRef;
    return this._textField || this._elementRef;
  }

  /** Animates the placeholder up and locks it in position. */
  _animateAndLockLabel(): void {
    // This is for backwards compatibility only. Consumers of the form field might use
    // this method. e.g. the autocomplete trigger. This method has been added to the non-MDC
    // form field because setting "floatLabel" to "always" caused the label to float without
    // animation. This is different in MDC where the label always animates, so this method
    // is no longer necessary. There doesn't seem any benefit in adding logic to allow changing
    // the floating label state without animations. The non-MDC implementation was inconsistent
    // because it always animates if "floatLabel" is set away from "always".
    // TODO(devversion): consider removing this method when releasing the MDC form field.
    if (this._hasFloatingLabel()) {
      this.floatLabel = 'always';
    }
  }

  /**
   * Toggles Bootstrap's validation classes `is-valid` & `is-invalid`.
   * @param hideValid Whether to remove Bootstrap's `is-valid` class.
   */
  protected displayValidity(hideValid?: boolean): void {
    const elem: HTMLElement|undefined = this._control?.controlElementRef?.nativeElement as HTMLElement;
    const classList = elem?.classList;
    if (classList) {
      const touched = classList.contains("ng-touched");
      const dirty   = classList.contains("ng-dirty");
      if (hideValid) {
        classList.toggle("is-valid", false);
      } else {
        classList.toggle("is-valid", classList.contains("ng-valid") && (touched));
      }
      if (this._control?.errorState) {
        classList.toggle("is-invalid", classList.contains("ng-invalid") && (touched || dirty));
      } else {
        classList.toggle("is-invalid", false);
      }
      this.markForCheck();
    }
  }

  /** Initializes the registered form field control. */
  private _initializeControl(previousControl: CuteFormFieldControl<any> | undefined) {
    const control = this._control;
    const classPrefix = 'cute-form-field-type-';

    if (previousControl) {
      this._elementRef.nativeElement.classList.remove(classPrefix + previousControl.controlType);
    }

    this._stateChanges?.unsubscribe();
    this._valueChanges?.unsubscribe();
    this._describedByChanges?.unsubscribe();

    if (control) {
      if (control.controlType) {
        this._elementRef.nativeElement.classList.add(classPrefix + control.controlType);
      }

      // Subscribe to changes in the child control state to update the form field UI.
      this._stateChanges = control.stateChanges?.subscribe(() => {
        this._updateFocusState();
        this.markForCheck();

        // CWT: Run CSS-classes validity after the change detection
        setTimeout(() => {
          this.displayValidity(this.hideValidStyle);
        });
      });

      // Updating the `aria-describedby` touches the DOM. Only do it if it actually needs to change.
      this._describedByChanges = control.stateChanges?.pipe(
          startWith([undefined, undefined] as const),
          map(() => [control.errorState, control.userAriaDescribedBy] as const),
          pairwise(),
          filter(([[prevErrorState, prevDescribedBy], [currentErrorState, currentDescribedBy]]) => {
            return prevErrorState !== currentErrorState || prevDescribedBy !== currentDescribedBy;
          }),
        )
        .subscribe(() => this._syncDescribedByIds());

      // Run change detection if the value changes.
      if (control.ngControl && control.ngControl.valueChanges) {
        this._valueChanges = control.ngControl.valueChanges
          .pipe(takeUntil(this._destroyed))
          .subscribe(() => this.markForCheck());
      }
    }
  }

  private _checkPrefixAndSuffixTypes() {
    this._hasIconPrefix = !!this._prefixChildren?.find(p => !p._isText);
    this._hasTextPrefix = !!this._prefixChildren?.find(p => p._isText);
    this._hasIconSuffix = !!this._suffixChildren?.find(s => !s._isText);
    this._hasTextSuffix = !!this._suffixChildren?.find(s => s._isText);
  }

  /** Initializes the prefix and suffix containers. */
  private _initializePrefixAndSuffix() {
    this._checkPrefixAndSuffixTypes();
    // Mark the form field as dirty whenever the prefix or suffix children change. This
    // is necessary because we conditionally display the prefix/suffix containers based
    // on whether there is projected content.
    merge(this._prefixChildren?.changes||EMPTY, this._suffixChildren?.changes||EMPTY).subscribe(() => {
      this._checkPrefixAndSuffixTypes();
      this.markForCheck();
    });
  }

  /**
   * Initializes the subscript by validating hints and synchronizing "aria-describedby" ids
   * with the custom form field control. Also subscribe to hint and error changes
   * to be able to validate and synchronize ids on change.
   */
  private _initializeSubscript() {
    // Re-validate when the number of hints changes.
    this._hintChildren?.changes.subscribe(() => {
      this._processHints();
      this.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    this._errorChildren?.changes.subscribe(() => {
      this._syncDescribedByIds();
      this.markForCheck();
    });

    // Initial mat-hint validation and subscript describedByIds sync.
    this._validateHints();
    this._syncDescribedByIds();
  }

  /** Throws an error if the form field's control is missing. */
  private _assertFormFieldControl() {
    if (!this._control && isDevMode()) {
      throw getCuteFormFieldMissingControlError();
    }
  }

  private _updateFocusState() {
    const controlFocused = this._control?.focused;

    // Usually, the MDC foundation would call "activateFocus" and "deactivateFocus" whenever
    // certain DOM events are emitted. This is not possible in our implementation of the
    // form field because we support abstract form field controls which are not necessarily
    // of type input, nor do we have a reference to a native form field control element. Instead,
    // we handle the focus by checking if the abstract form field control focused state changes.
    if (controlFocused && !this._isFocused) {
      this._isFocused = true;
      //this._lineRipple?.activate();
    } else if (!controlFocused && (this._isFocused || this._isFocused === null)) {
      this._isFocused = false;
      //this._lineRipple?.deactivate();
    }

    this._elementRef.nativeElement.classList.toggle('cute-focused', controlFocused);
    this._textField?.nativeElement.classList.toggle('cute-text-field--focused', controlFocused);
  }

  /**
   * The floating label in the docked state needs to account for prefixes. The horizontal offset
   * is calculated whenever the appearance changes to `outline`, the prefixes change, or when the
   * form field is added to the DOM. This method sets up all subscriptions that are needed to
   * trigger the label offset update. In general, we want to avoid performing measurements often,
   * so we rely on the `NgZone` as indicator when the offset should be recalculated, instead of
   * checking every change detection cycle.
   * @deprecated
   */
  private _initializeOutlineLabelOffsetSubscriptions() {
    // Whenever the prefix changes, schedule an update of the label offset.
    this._prefixChildren?.changes.subscribe(
        () => (this._needsOutlineLabelOffsetUpdate = true),
    );

    // TODO(mmalerba): Split this into separate `afterEveryRender` calls using the `EarlyRead` and
    //  `Write` phases.
    afterEveryRender(
      () => {
        if (this._needsOutlineLabelOffsetUpdate) {
          this._needsOutlineLabelOffsetUpdate = false;
          this._getOutlinedLabelOffset();
        }
      },
      {
        injector: this._injector,
      },
    );

    this._dir.change
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => (this._needsOutlineLabelOffsetUpdate = true));
  }

  /** Is there any `<cute-label>` in the form field? */
  protected _hasFloatingLabel = computed(() => !!this._labelChild());

  /** Whether the floating label should always float or not. */
  protected _shouldAlwaysFloat() {
    return this.floatLabel === 'always';
  }

  /** <cute-datepicker> uses this method */
  _shouldLabelFloat(): boolean {
    //return false;
    if (!this._hasFloatingLabel()) {
      return false;
    }
    return this._control?.shouldLabelFloat || this._shouldAlwaysFloat();
  }

  /**
   * Determines whether a class from the AbstractControlDirective
   * should be forwarded to the host element.
   */
  protected _shouldForward(prop: keyof AbstractControlDirective): boolean {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }

  /**
   *  Determines whether to display hints or errors.
   *  @author A.Strelkov:
   *  + Add _undefined_ to return value when no hints and errors exist.
   *  + Change to `protected`.
   */
  protected _getSubscriptMessageType(): 'error' | 'hint' | undefined {
    return this._errorChildren && this._errorChildren.length > 0 && this._control?.errorState
      ? 'error'
      : this._hintChildren && this._hintChildren.length > 0
        ? 'hint'
        : undefined;
  }

  /** Does any extra processing required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each "cute-hint" alignment specified. The hint
   * label specified set through the input is being considered as "start" aligned.
   *
   * This method is a noop if Angular runs in production mode.
   */
  private _validateHints() {
    if (this._hintChildren && isDevMode()) {
      let startHint: CuteHint;
      let endHint: CuteHint;
      this._hintChildren.forEach((hint: CuteHint) => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw getCuteFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getCuteFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      let ids: string[] = [];

      // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
      if (
          this._control.userAriaDescribedBy &&
          typeof this._control.userAriaDescribedBy === 'string'
      ) {
        ids.push(...this._control.userAriaDescribedBy.split(' '));
      }

      if (this._getSubscriptMessageType() === 'hint') {
        const startHint = this._hintChildren
            ? this._hintChildren.find(hint => hint.align === 'start')
            : null;
        const endHint = this._hintChildren
            ? this._hintChildren.find(hint => hint.align === 'end')
            : null;

        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map(error => error.id));
      }

      const existingDescribedBy = this._control.describedByIds;
      let toAssign: string[];

      // In some cases there might be some `aria-describedby` IDs that were assigned directly,
      // like by the `AriaDescriber` (see #30011). Attempt to preserve them by taking the previous
      // attribute value and filtering out the IDs that came from the previous `setDescribedByIds`
      // call. Note the `|| ids` here allows us to avoid duplicating IDs on the first render.
      if (existingDescribedBy) {
        const exclude = this._describedByIds || ids;
        toAssign = ids.concat(existingDescribedBy.filter(id => id && !exclude.includes(id)));
      } else {
        toAssign = ids;
      }

      this._control.setDescribedByIds(toAssign);
      this._describedByIds = ids;
    }
  }

  /**
   * Calculates the horizontal offset of the label in the outline appearance. In the outline
   * appearance, the notched-outline and label are not relative to the infix container because
   * the outline intends to surround prefixes, suffixes and the infix. This means that the
   * floating label by default overlaps prefixes in the docked state. To avoid this, we need to
   * horizontally offset the label by the width of the prefix container. The MDC text-field does
   * not need to do this because they use a fixed width for prefixes. Hence, they can simply
   * incorporate the horizontal offset into their default text-field styles.
   */
  private _getOutlinedLabelOffset(): OutlinedLabelStyles {
    return null;

    /*
    if (!this._hasOutline() || !this._floatingLabel) {
      return;
    }
    const floatingLabel = this._floatingLabel.element;
    // If no prefix is displayed, reset the outline label offset from potential
    // previous label offset updates.
    if (!(this._iconPrefixContainer || this._textPrefixContainer)) {
      floatingLabel.style.transform = '';
      return;
    }
    // If the form field is not attached to the DOM yet (e.g. in a tab), we defer
    // the label offset update until the zone stabilizes.
    if (!this._isAttachedToDom()) {
      this._needsOutlineLabelOffsetUpdate = true;
      return;
    }
    const iconPrefixContainer = this._iconPrefixContainer?.nativeElement;
    const textPrefixContainer = this._textPrefixContainer?.nativeElement;
    const iconSuffixContainer = this._iconSuffixContainer?.nativeElement;
    const textSuffixContainer = this._textSuffixContainer?.nativeElement;
    const iconPrefixContainerWidth = iconPrefixContainer?.getBoundingClientRect().width ?? 0;
    const textPrefixContainerWidth = textPrefixContainer?.getBoundingClientRect().width ?? 0;
    const iconSuffixContainerWidth = iconSuffixContainer?.getBoundingClientRect().width ?? 0;
    const textSuffixContainerWidth = textSuffixContainer?.getBoundingClientRect().width ?? 0;
    // If the directionality is RTL, the x-axis transform needs to be inverted. This
    // is because `transformX` does not change based on the page directionality.
    const negate = this._dir.value === 'rtl' ? '-1' : '1';
    const prefixWidth = `${iconPrefixContainerWidth + textPrefixContainerWidth}px`;
    const labelOffset = `var(--mat-mdc-form-field-label-offset-x, 0px)`;
    const labelHorizontalOffset = `calc(${negate} * (${prefixWidth} + ${labelOffset}))`;

    // Update the translateX of the floating label to account for the prefix container,
    // but allow the CSS to override this setting via a CSS variable when the label is
    // floating.
    floatingLabel.style.transform = `var(
        --mat-mdc-form-field-label-transform,
        ${FLOATING_LABEL_DEFAULT_DOCKED_TRANSFORM} translateX(${labelHorizontalOffset})
    )`;

    // Prevent the label from overlapping the suffix when in resting position.
    const prefixAndSuffixWidth =
      iconPrefixContainerWidth +
      textPrefixContainerWidth +
      iconSuffixContainerWidth +
      textSuffixContainerWidth;
    this._elementRef.nativeElement.style.setProperty(
      '--mat-form-field-notch-max-width',
      `calc(100% - ${prefixAndSuffixWidth}px)`,
    );
    */
  }

  /** Checks whether the form field is attached to the DOM. */
  private _isAttachedToDom(): boolean {
    const element: HTMLElement = this._elementRef.nativeElement;
    if (element.getRootNode) {
      const rootNode = element.getRootNode();
      // If the element is inside the DOM, the root node will be either the document
      // or the closest shadow root, otherwise it'll be the element itself.
      return rootNode && rootNode !== element;
    }
    // Otherwise, fall back to checking if it's in the document. This doesn't account for
    // shadow DOM, however, browser that supports shadow DOM should support `getRootNode` as well.
    return document.documentElement!.contains(element);
  }

}
