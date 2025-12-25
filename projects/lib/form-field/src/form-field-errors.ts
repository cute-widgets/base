
/** @docs-private */
export function getCuteFormFieldPlaceholderConflictError(): Error {
    return Error('Placeholder attribute and child element were both specified.');
}

/** @docs-private */
export function getCuteFormFieldDuplicatedHintError(align: string): Error {
    return Error(`A hint was already declared for 'align="${align}"'.`);
}

/** @docs-private */
export function getCuteFormFieldMissingControlError(): Error {
    return Error('cute-form-field must contain a CuteFormFieldControl.');
}
