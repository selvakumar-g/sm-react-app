import React from 'react';
import { ElementWrapper } from './elementwrapper';
import { InputElem, TextAreaElem, SelectElem, MultiSelectElem, DatePickerElem, INPUT_TYPES } from './inputs';


export const createElement = (type, props) => {
    let elem = null;
    if (INPUT_TYPES.INPUT === type)
        elem = <InputElem {...props} />
    else if (INPUT_TYPES.TEXTAREA === type)
        elem = <TextAreaElem {...props} />
    else if (INPUT_TYPES.SELECT === type)
        elem = <SelectElem {...props} />
    else if (INPUT_TYPES.MULTISELECT === type)
        elem = <MultiSelectElem {...props} />
    else if (INPUT_TYPES.DAYPICKER === type)
        elem = <DatePickerElem {...props} />
    return elem;
}

export const createFormElems = (formConfig, stateConfig, statePropsMap) => {
    let formRowElems = [];
    Object.keys(formConfig).forEach(key => {
        const value = formConfig[key];
        const propVal = {
            formAttr: value, stateAttr: stateConfig[key],
            ...statePropsMap.get(key)
        }
        let elem = createElement(value.type, propVal);
        
        if (!formRowElems[value.row - 1])
            formRowElems[value.row - 1] = [];
        formRowElems[value.row - 1].push((<ElementWrapper key={value.row + "" + value.column} hidden={value.inputType}>{elem}</ElementWrapper>));
    });

    const formElements = formRowElems.map((elements, index) => {
        return (
            <div className="row" key={index}>
                {elements}
            </div>
        )
    })

    return formElements;
}

