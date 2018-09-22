import { Rules } from '../../component/common/rule';
import { INPUT_TYPES } from '../../component/common/inputs';

export const SCREEN_NAME = "Manage onetime."

export const ONETIME_CONFIG = {
    fieldTypes: {
        name: 'fieldTypes', label: 'Field types', placeholder: 'Select field type',
        options: [], row: 1, column: 1, type: INPUT_TYPES.SELECT
    },
    fieldType: {
        name: 'fieldType', label: 'Field type', placeholder: 'Enter field type',
        rules: { [Rules.MANDATORY]: 'Field type cannot be empty' },
        row: 2, column: 1, type: INPUT_TYPES.INPUT
    },
    fieldVal: {
        name: 'fieldVal', label: 'Field value', placeholder: 'Enter field value',
        rules: { [Rules.MANDATORY]: 'Field value cannot be empty' },
        row: 2, column: 2, type: INPUT_TYPES.INPUT
    }
}