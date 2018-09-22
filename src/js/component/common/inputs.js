import React, { Fragment } from 'react';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate } from 'react-day-picker/moment';
import "react-day-picker/lib/style.css";

import Select from 'react-select';

export const INPUT_TYPES = {
    INPUT: 'INPUT',
    TEXTAREA: 'TEXTAREA',
    SELECT: 'SELECT',
    MULTISELECT: 'MULTISELECT',
    DAYPICKER: 'DAYPICKER'
}

const LabelElem = (props) => {
    return props.label ? <label>{props.label}</label> : null;
}

export const InputElem = (props) => {
    let classes = ['form-control'];
    const inputType = props.formAttr.inputType ? props.formAttr.inputType : 'text';
    if (props.formAttr.classes)
        classes.push(...props.formAttr.classes)

    if (props.stateAttr.errors && props.stateAttr.errors.length)
        classes.push('is-invalid');

    return (
        <Fragment>
            <LabelElem label={props.formAttr.label} />
            <input type={inputType} className={classes.join(' ')}
                name={props.formAttr.name} value={props.stateAttr.value ? props.stateAttr.value : ''} disabled={props.disabled ? true : false}
                placeholder={props.formAttr.placeholder} onChange={props.onChangeHandler} {...props.dataProps} />
            <div className="invalid-feedback">{props.stateAttr.errors.join(' ')}</div>
        </Fragment>
    );
}

export const TextAreaElem = (props) => {
    let classes = ['form-control'];
    if (props.formAttr.classes)
        classes.push(...props.formAttr.classes)

    if (props.stateAttr.errors && props.stateAttr.errors.length)
        classes.push('is-invalid');

    return (
        <Fragment>
            <LabelElem label={props.formAttr.label} />
            <textarea className={classes.join(' ')}
                name={props.formAttr.name} value={props.stateAttr.value ? props.stateAttr.value : ''} disabled={props.disabled ? true : false}
                placeholder={props.formAttr.placeholder} onChange={props.onChangeHandler} {...props.dataProps} />
            <div className="invalid-feedback">{props.stateAttr.errors.join(' ')}</div>
        </Fragment>
    );
}

export const SelectElem = (props) => {
    let classes = ['form-control', 'custom-select'];
    if (props.stateAttr.errors && props.stateAttr.errors.length)
        classes.push('is-invalid');

    let options = props.stateAttr.options ? props.stateAttr.options.map(optionItem => {
        return (
            <option value={optionItem.value} key={optionItem.text}>{optionItem.text}</option>
        )
    }) : props.formAttr.options.map(optionItem => {
        return (
            <option value={optionItem.value} key={optionItem.text}>{optionItem.text}</option>
        )
    })
    options.unshift(
        <option value='' key={props.formAttr.placeholder}>{props.formAttr.placeholder}</option>);
    return (
        <Fragment>
            <LabelElem label={props.formAttr.label} />
            <select className={classes.join(' ')} name={props.formAttr.name} disabled={props.disabled}
                value={props.stateAttr.value ? props.stateAttr.value : ''}
                onChange={props.onChangeHandler} {...props.dataProps} >
                {options}
            </select>
            <div className="invalid-feedback">{props.stateAttr.errors.join(' ')}</div>
        </Fragment>
    );
}


export const MultiSelectElem = (props) => {
    let classes = ['form-control', 'custom-select'];
    if (props.stateAttr.errors && props.stateAttr.errors.length)
        classes.push('is-invalid');

    const optionValues = props.stateAttr.options ? props.stateAttr.options : props.formAttr.options;
    let options = optionValues.map(optionItem => {
        return { label: optionItem.text, value: optionItem.value }
    });

    const msValue = props.stateAttr.value ? props.stateAttr.value.split(',').map(val => {
        return options.filter(optionsObj => optionsObj.value === val)[0];
    }) : '';

    const onChangeHandler = (selectedArr) => {
        let selectedValues = selectedArr ? selectedArr.map(option => option['value']).join(',') : '';
        props.onChangeHandler({
            target: { name: props.formAttr.name, value: selectedValues }
        });
    }

    return (
        <Fragment>
            <LabelElem label={props.formAttr.label} />
            <Select options={options} isMulti
                onChange={onChangeHandler} value={msValue} {...props.dataProps} />
            <div className="invalid-feedback">{props.stateAttr.errors.join(' ')}</div>
        </Fragment>
    );
}

export const DatePickerElem = (props) => {
    let classes = ['form-control'];
    let errDescClasses = ['invalid-feedback'];
    if (props.formAttr.classes)
        classes.push(...props.formAttr.classes)

    if (props.stateAttr.errors && props.stateAttr.errors.length) {
        classes.push('is-invalid');
        errDescClasses.push('d-block');
    }

    const inputProps = { className: classes.join(' ') }
    const onDayChange = (day) => {
        const formattedValue = day ? formatDate(day, "DD-MMM-YYYY") : null;
        props.onChangeHandler({
            target: {
                name: props.formAttr.name,
                value: formattedValue,
            }
        });
    }

    return (
        <Fragment>
            <LabelElem label={props.formAttr.label} />
            <DayPickerInput
                placeholder={props.formAttr.placeholder} format="DD-MMM-YYYY" formatDate={formatDate} inputProps={inputProps}
                onDayChange={onDayChange} value={props.stateAttr.value ? props.stateAttr.value : ''} />
            <div className={errDescClasses.join(' ')}>{props.stateAttr.errors.join(' ')}</div>
        </Fragment>
    );
}




