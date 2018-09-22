import React, { Component } from 'react';

import { ONETIME_CONFIG, SCREEN_NAME } from './onetimeconfig';
import { FormSection, HeaderSection, SubHeaderSection } from '../../component/common/elementwrapper';
import { createFormElems } from '../../component/common/utility';
import { validateRule } from '../../component/common/rule';
import OnetimeTable from '../../component/onetime/onetimetable';
import AsyncUtil from '../../component/common/ajaxutil';
 

class Onetime extends Component {

    getPlainFormValues() {
        return {
            fieldTypes: { value: '', errors: [] },
            fieldType: { value: '', errors: [] },
            fieldVal: { value: '', errors: [] }
        }
    }

    state = {
        formElementValues: this.getPlainFormValues(),
        formUpdate: false,
        onetimesCaptured: []
    }

    formElementAttr = ONETIME_CONFIG;

    componentDidMount() {
        this.initialize();
    }

    initialize = () => {
        AsyncUtil.get('/onetime/findAll', null, data => {
            if (data) {
                let otMap = new Map();
                data.forEach(otv => {
                    if (!otMap.has(otv.fieldType))
                        otMap.set(otv.fieldType, {
                            value: otv.fieldType, text: otv.fieldType
                        });
                })
                let newValue = this.getPlainFormValues();
                newValue['fieldTypes'].options = Array.from(otMap.values())
                this.setState({
                    formElementValues: newValue,
                    formUpdate: false,
                    onetimesCaptured: []
                })
            }
        });
    }


    onChangeHandler = (event) => {
        let formElemState = this.state.formElementValues;
        let elemState = { ...formElemState[event.target.name] };
        elemState['value'] = event.target.value;
        if (event.target.name === "fieldTypes") {
            let name = event.target.name, val = event.target.value;
            let fieldTypeState = { ...formElemState['fieldType'] };
            fieldTypeState['value'] = event.target.value;
            if (val) {
                AsyncUtil.get('/onetime/find/' + val, null, data => {
                    this.setState({
                        formElementValues: {
                            ...formElemState,
                            [name]: elemState,
                            ['fieldType']: fieldTypeState
                        },
                        formUpdate: true,
                        onetimesCaptured: data ? data : []
                    });
                });
            } else
                this.setState({
                    formElementValues: {
                        ...formElemState,
                        [name]: elemState,
                        ['fieldType']: fieldTypeState
                    },
                    formUpdate: false,
                    onetimesCaptured: []
                })
        } else
            this.setState({
                formElementValues: {
                    ...formElemState,
                    [event.target.name]: elemState
                }
            })
    }

    validateForm = (formElemState) => {
        let keys = Object.keys(formElemState);
        let isFormValid = true;
        keys.forEach((key) => {
            if (formElemState[key].errors.length)
                formElemState[key].errors.splice(0, formElemState[key].errors.length);
            let value = formElemState[key].value;
            let rules = this.formElementAttr[key].rules;
            if (rules) {
                let ruleKeys = Object.keys(rules);
                ruleKeys.forEach((ruleKey) => {
                    let result = validateRule(ruleKey, value);
                    if (!result) {
                        isFormValid = result;
                        formElemState[key].errors.push(rules[ruleKey]);
                    }
                });
            }
        });
        return isFormValid;
    }

    saveHandler = () => {
        let formElemState = this.state.formElementValues;
        let isFormOK = this.validateForm(formElemState);
        if (isFormOK) {
            AsyncUtil.post('/onetime/save', {
                fieldType: formElemState['fieldType'].value,
                fieldVal: formElemState['fieldVal'].value
            }, data => {
                formElemState['fieldType'].value = formElemState['fieldTypes'].value;
                formElemState['fieldVal'].value = '';
                this.setState({
                    formElementValues: formElemState,
                    onetimesCaptured: formElemState['fieldTypes'].value ? data : [],
                    formUpdate: formElemState['fieldTypes'].value ? true : false
                });
            })
        } else {
            this.setState({
                formElementValues: formElemState
            });
        }
    }

    resetHandler = () => {
        this.initialize();
    }

    onetimeDeleteHandler = (fieldType, fieldVal) => {
        let formElemState = this.state.formElementValues;
        AsyncUtil.delete('/onetime/delete/' + fieldType + '/' + fieldVal, null, data => {
            formElemState['fieldType'].value = formElemState['fieldTypes'].value;
            formElemState['fieldVal'].value = '';
            this.setState({
                formElementValues: formElemState,
                onetimesCaptured: formElemState['fieldTypes'].value ? data : [],
                formUpdate: formElemState['fieldTypes'].value ? true : false
            });
        })
    }

    render() {
        let elemStateProps = new Map();
        elemStateProps.set('fieldType', { disabled: this.state.formUpdate });

        Object.keys(this.state.formElementValues).forEach(key => {
            let obj = elemStateProps.has(key) ? elemStateProps.get(key) : {};
            obj.onChangeHandler = this.onChangeHandler;
            if (!elemStateProps.has(key))
                elemStateProps.set(key, obj);
        });

        const formElements = createFormElems(this.formElementAttr, this.state.formElementValues,
            elemStateProps);

        return (
            <FormSection>
                <HeaderSection headerName={SCREEN_NAME} />
                {formElements}
                <div className="row">
                    <div className="col-md-4 mb-3 offset-md-8 d-flex justify-content-end">
                        <div className="mr-4">
                            <button type="button" className="btn btn-success"
                                onClick={this.saveHandler}>Save</button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-secondary"
                                onClick={this.resetHandler} >Reset</button>
                        </div>
                    </div>
                </div>
                <SubHeaderSection subHeaderName="Onetimes captured" />
                <OnetimeTable onetimeData={this.state.onetimesCaptured}
                    deleteHandler={this.onetimeDeleteHandler} />

            </FormSection>
        );
    }
}

export default Onetime;