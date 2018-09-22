import { Rules } from '../../component/common/rule';
import { INPUT_TYPES } from '../../component/common/inputs';

export const SCREEN_NAME = "Manage loan transaction."

export const LOAN_TXN_CONFIG = {
    loanName: {
        name: 'loanName', label: 'Loan name', placeholder: 'Select loan name',
        rules: { [Rules.MANDATORY]: 'Loan name cannot be empty' },
        options: [], row: 1, column: 1, type: INPUT_TYPES.SELECT
    },
    sequenceNumber: {
        name: 'sequenceNumber', inputType: 'hidden',        
        row: 1, column: 2, type: INPUT_TYPES.INPUT
    },
    transactionDate: {
        name: 'transactionDate', label: 'Transaction date', placeholder: 'Enter transaction date',
        rules: { [Rules.MANDATORY]: 'Transaction date cannot be empty' }, row: 2, column: 1, type: INPUT_TYPES.DAYPICKER
    },
    transactionType: {
        name: 'transactionType', label: 'Transaction type', placeholder: 'Enter transaction type',
        rules: { [Rules.MANDATORY]: 'Transaction type cannot be empty' },
        row: 2, column: 2, type: INPUT_TYPES.SELECT, 
        options: [], optionsVal: 'loan_txn_type'
    },
    amount: {
        name: 'amount', label: 'Amount', placeholder: 'Enter amount',
        rules: { [Rules.NUMBER_MANDATORY]: 'Amount cannot be empty' },
        row: 2, column: 3, type: INPUT_TYPES.INPUT
    },
    remarks: {
        name: 'remarks', label: 'Remarks', placeholder: 'Enter remarks',
        row: 3, column: 1, type: INPUT_TYPES.TEXTAREA
    }
}

