import { Rules } from '../../component/common/rule';
import { INPUT_TYPES } from '../../component/common/inputs';

export const SCREEN_NAME = "Manage Vehicle."

export const VEHICLE_CONFIG = {
    vehicleName: {
        name: 'vehicleName', label: 'Vehicle name', placeholder: 'Enter vehicle name',
        rules: { [Rules.MANDATORY]: 'Vehicle name cannot be empty' }, row: 1, column: 1, type: INPUT_TYPES.INPUT
    },
    vehicleNumber: {
        name: 'vehicleNumber', label: 'Vehicle number', placeholder: 'Enter vehicle number',
        rules: { [Rules.MANDATORY]: 'Vehicle number cannot be empty' }, row: 2, column: 1, type: INPUT_TYPES.INPUT
    },
    vehicleType: {
        name: 'vehicleType', label: 'Vehicle type', placeholder: 'Select vehicle type',
        rules: { [Rules.MANDATORY]: 'Vehicle type cannot be empty' },
        options: [], row: 2, column: 2, type: INPUT_TYPES.SELECT, optionsVal: 'vehicle_type'
    },
    vehicleStatus: {
        name: 'vehicleStatus', label: 'Vehicle status', placeholder: 'Select vehicle status',
        rules: { [Rules.MANDATORY]: 'Vehicle status cannot be empty' },
        options: [], row: 2, column: 3, type: INPUT_TYPES.SELECT, optionsVal: 'vehicle_status'
    },
    vehicleCost: {
        name: 'vehicleCost', label: 'Vehicle cost', placeholder: 'Enter Vehicle cost',
        rules: { [Rules.NUMBER_MANDATORY]: 'Vehicle cost cannot be empty' }, row: 3, column: 1, type: INPUT_TYPES.INPUT
    },
    investment: {
        name: 'investment', label: 'Investment', placeholder: 'Enter investment',
        rules: { [Rules.NUMBER]: 'Investement cannot be empty' }, row: 3, column: 2, type: INPUT_TYPES.INPUT
    },
    vehicleLoans: {
        name: 'vehicleLoans', label: 'Loans', placeholder: 'Select loans',
        options: [{ value: '2499', text: '2499' }, { value: '2500', text: '2500' }], row: 3, column: 3, type: INPUT_TYPES.MULTISELECT
    }
}

