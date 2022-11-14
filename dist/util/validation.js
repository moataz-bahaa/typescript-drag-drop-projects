const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email.toLowerCase());
};
export function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid && (isValid = validatableInput.value.toString().trim().length !== 0);
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid && (isValid = validatableInput.value.trim().length >= validatableInput.minLength);
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid && (isValid = validatableInput.value.trim().length <= validatableInput.maxLength);
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid && (isValid = validatableInput.value >= validatableInput.min);
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid && (isValid = validatableInput.value <= validatableInput.max);
    }
    if (validatableInput.isEmail) {
        isValid && (isValid = typeof validatableInput.value === 'string' && validateEmail(validatableInput.value));
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map