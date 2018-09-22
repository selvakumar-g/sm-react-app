import { Rules } from '../../component/common/rule';
import { INPUT_TYPES } from '../../component/common/inputs';

export const SCREEN_NAME = "Manage vehicle transaction."

export const VEHICLE_TXN_CONFIG = {
    vehicleName: {
        name: 'vehicleName', label: 'Vehicle name', placeholder: 'Select vehicle name',
        rules: { [Rules.MANDATORY]: 'Vehicle name cannot be empty' },
        options: [], row: 1, column: 1, type: INPUT_TYPES.SELECT
    },
    transactionDate: {
        name: 'transactionDate', label: 'Transaction date', placeholder: 'Enter transaction date',
        rules: { [Rules.MANDATORY]: 'Transaction date cannot be empty' }, row: 1, column: 2, type: INPUT_TYPES.DAYPICKER
    },
    sequenceNumber: {
        name: 'sequenceNumber', inputType: 'hidden',        
        row: 1, column: 3, type: INPUT_TYPES.INPUT
    },    
    transactionAttribute: {
        name: 'transactionAttribute', label: 'Transaction attribute', placeholder: 'Enter transaction attribute',
        rules: { [Rules.MANDATORY]: 'Transaction attribute cannot be empty' },        
        row: 2, column: 1, type: INPUT_TYPES.SELECT, 
        options: [], optionsVal: 'vehicle_txn_attribute'
    },
    amount: {
        name: 'amount', label: 'Amount', placeholder: 'Enter amount',
        rules: { [Rules.NUMBER_MANDATORY]: 'Amount cannot be empty' },
        row: 2, column: 2, type: INPUT_TYPES.INPUT
    },
    remarks: {
        name: 'remarks', label: 'Remarks', placeholder: 'Enter remarks',
        row: 2, column: 3, type: INPUT_TYPES.TEXTAREA
    }
}

