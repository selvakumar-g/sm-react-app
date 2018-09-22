import { Rules } from '../../component/common/rule';
import { INPUT_TYPES } from '../../component/common/inputs';
export const SCREEN_NAME = "Manage loan."

export const LOAN_CONFIG = {
    loanName: {
        name: 'loanName', label: 'Loan name', placeholder: 'Enter loan name',
        rules: { [Rules.MANDATORY]: 'Loan name cannot be empty' }, row: 1, column: 1, type: INPUT_TYPES.INPUT
    },
    loanDescription: {
        name: 'loanDescription', label: 'Loan description', placeholder: 'Enter loan description',
        rules: { [Rules.MANDATORY]: 'Loan description cannot be empty' }, row: 1, column: 2, type: INPUT_TYPES.INPUT
    },
    loanStartDate: {
        name: 'loanStartDate', label: 'Loan start date', placeholder: 'Enter loan start date',
        rules: { [Rules.MANDATORY]: 'Loan start date cannot be empty' }, row: 2, column: 1, type: INPUT_TYPES.DAYPICKER
    },
    loanEndDate: {
        name: 'loanEndDate', label: 'Loan end date', placeholder: 'Enter loan end date',
        row: 2, column: 2, type: INPUT_TYPES.DAYPICKER
    },
    loanType: {
        name: 'loanType', label: 'Loan type', placeholder: 'Select loan type',
        rules: { [Rules.MANDATORY]: 'Loan type cannot be empty' },
        row: 2, column: 3, type: INPUT_TYPES.SELECT,
        options: [], optionsVal: 'loan_type'
    },
    loanAmount: {
        name: 'loanAmount', label: 'Loan amount', placeholder: 'Enter loan amount',
        rules: { [Rules.NUMBER_MANDATORY]: 'Loan amount cannot be empty' }, row: 3, column: 1, type: INPUT_TYPES.INPUT
    },
    loanPeriod: {
        name: 'loanPeriod', label: 'Loan period', placeholder: 'Enter loan period',
        rules: { [Rules.NUMBER_MANDATORY]: 'Loan period cannot be empty' }, row: 3, column: 2, type: INPUT_TYPES.INPUT
    },
    loanStatus: {
        name: 'loanStatus', label: 'Loan status', placeholder: 'Select loan status',
        rules: { [Rules.MANDATORY]: 'Loan status cannot be empty' },
        row: 3, column: 3, type: INPUT_TYPES.SELECT,
        options: [], optionsVal: 'loan_status'
    }
}

