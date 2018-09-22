export const Rules = {
    MANDATORY: 'MANDATORY',
    NUMBER: 'NUMBER',
    NUMBER_MANDATORY: 'NUMBER_MANDATORY'
}


export const validateRule = (ruleName, value) => {
    switch (ruleName) {
        case Rules.MANDATORY:
            if (value == null || value.trim().length === 0)
                return false;
            else
                return true;
        case Rules.NUMBER:
            return isFinite(value);
        case Rules.NUMBER_MANDATORY:
            return (isFinite(value) && value > 0);
        default:
            return false;
    }
}