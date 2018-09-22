import React, { Component } from 'react';

import { LOAN_TXN_CONFIG, SCREEN_NAME } from './loantxnconfig';
import { FormSection, HeaderSection, SubHeaderSection } from '../../component/common/elementwrapper';
import { createFormElems } from '../../component/common/utility';
import { validateRule } from '../../component/common/rule';
import LoanTxnTable from '../../component/loantxn/loantxntable'

import { INPUT_TYPES } from '../../component/common/inputs';
import AsyncUtil from '../../component/common/ajaxutil';

import axios from 'axios';

class LoanTxn extends Component {

    getPlainFormValues() {
        return {
            loanName: { value: '', errors: [] },
            sequenceNumber: { value: '', errors: [] },
            transactionDate: { value: '', errors: [] },
            transactionType: { value: '', errors: [] },
            amount: { value: '', errors: [] },
            remarks: { value: '', errors: [] }
        }
    }
    state = {
        formElementValues: this.getPlainFormValues(),
        formUpdate: false,
        loanTxnCaptured: []
    }

    formElementAttr = LOAN_TXN_CONFIG;

    componentDidMount() {
        this.initialize()
    }

    initialize = () => {
        let plainState = this.getPlainFormValues();
        let oneTimeVarMap = new Map();
        Object.keys(this.formElementAttr).forEach(key => {
            if (this.formElementAttr[key].type === INPUT_TYPES.SELECT &&
                this.formElementAttr[key].optionsVal) {
                oneTimeVarMap.set(key, this.formElementAttr[key].optionsVal);
            }
        });
        if (oneTimeVarMap.size > 0) {
            let values = Array.from(oneTimeVarMap.values()).join(',')
            axios.all([
                axios.get('/onetime/findOneTimes/' + values),
                axios.get('/loan/findAll')
            ]).then(axios.spread((oneTimePromise, loanPromise) => {
                let oneTimeRes = oneTimePromise.data.details, loanRes = loanPromise.data.details;
                let oneTimeObjMap = new Map();
                for (let [mapKey, mapVal] of oneTimeVarMap.entries()) {
                    if (oneTimeRes[mapVal]) {
                        let optArr = oneTimeRes[mapVal].map((data) => {
                            return { value: data.fieldVal, text: data.fieldVal }
                        });
                        oneTimeObjMap.set(mapKey, optArr);
                    }
                }
                let oneTimeStateObj = {};
                for (let [mapKey, mapVal] of oneTimeObjMap.entries()) {
                    oneTimeStateObj[mapKey] = {
                        ...plainState[mapKey],
                        options: mapVal
                    }
                }
                const loanOTValues = loanRes ? loanRes.map(loanVal => {
                    return {
                        value: loanVal.loanName, text: loanVal.loanName
                    }
                }) : [];
                const loanNameObj = {
                    loanName: {
                        ...plainState['loanName'],
                        options: loanOTValues
                    }
                }
                this.setState({
                    formElementValues: {
                        ...plainState,
                        ...oneTimeStateObj,
                        ...loanNameObj
                    },
                    formUpdate: false,
                    loanTxnCaptured: []
                })
            }))
        } else {
            AsyncUtil.get('loan/findAll', null, data => {
                let loanOTValues = data ? data.map(loanVal => {
                    return {
                        value: loanVal.loanName, text: loanVal.loanName
                    }
                }) : [];
                this.setState({
                    formElementValues: {
                        ...plainState,
                        loanName: {
                            ...plainState['loanName'],
                            options: loanOTValues
                        }
                    },
                    formUpdate: false,
                    loanTxnCaptured: []
                })

            });
        }
    }


    onChangeHandler = (event) => {
        let formElemState = this.state.formElementValues;
        let elemState = formElemState[event.target.name];
        elemState['value'] = event.target.value;
        this.setState({
            formElementValues: {
                ...formElemState,
                [event.target.name]: elemState
            }
        });

        if (event.target.name === 'loanName') {
            if (event.target.value) {
                AsyncUtil.get('/loan_txn/findLoanTxn/' + event.target.value, null, (data) => {
                    this.setState({
                        loanTxnCaptured: data
                    });
                });
            } else if (this.state.loanTxnCaptured)
                this.setState({
                    loanTxnCaptured: []
                });
        }
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

    getFormValues = () => {
        let formValues = {};
        Object.keys(this.state.formElementValues).forEach(key => {
            formValues[key] = this.state.formElementValues[key].value;
        })
        return formValues;
    }

    saveHandler = () => {
        let formElemState = {};
        Object.keys(this.state.formElementValues).forEach((key) => {
            formElemState[key] = { ...this.state.formElementValues[key], errors: [] };
        });
        let isFormOK = this.validateForm(formElemState);
        if (isFormOK) {
            const formValues = this.getFormValues();
            AsyncUtil.post('/loan_txn/save', formValues, (data) => {
                Object.keys(this.state.formElementValues).forEach((key) => {
                    formElemState[key].value = '';
                });
                this.setState({
                    formElementValues: formElemState,
                    loanTxnCaptured: data,
                    formUpdate: false
                });
            });
        } else {
            this.setState({
                formElementValues: formElemState
            });
        }
    }

    resetHandler = () => {
        this.initialize();
    }

    loanTxnUpdateHandler = (loanName, sequenceNumber) => {
        let loanTxnCapturedState = this.state.loanTxnCaptured;
        let loanTxnCardIndex = loanTxnCapturedState.findIndex(txn =>
            (txn.loanName === loanName && txn.sequenceNumber === sequenceNumber));
        let loanTxn = loanTxnCapturedState[loanTxnCardIndex];
        let formElemState = {};
        let keys = Object.keys(loanTxn);
        keys.forEach(key => {
            formElemState[key] = { ...this.state.formElementValues[key], errors: [] };
            formElemState[key].value = loanTxn[key];
        });

        this.setState({
            formElementValues: formElemState,
            formUpdate: true
        });
    }

    loanTxnDeleteHandler = (loanName, sequenceNumber) => {
        AsyncUtil.delete('/loan_txn/delete/' + loanName + '/' + sequenceNumber, null, (data) => {
            this.setState({
                loanTxnCaptured: data
            });
        });
    }

    render() {
        let elemStateProps = new Map();
        elemStateProps.set('loanName', { disabled: this.state.formUpdate });

        Object.keys(this.state.formElementValues).forEach(key => {
            let obj = elemStateProps.has(key) ? elemStateProps.get(key) : {};
            obj.onChangeHandler = this.onChangeHandler;
            if (!elemStateProps.has(key))
                elemStateProps.set(key, obj);
        });
        console.log(elemStateProps)
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
                <SubHeaderSection subHeaderName="Loan transactions captured" />
                <LoanTxnTable loanTxnData={this.state.loanTxnCaptured}
                    updateHandler={this.loanTxnUpdateHandler} deleteHandler={this.loanTxnDeleteHandler} />

            </FormSection>
        );
    }
}





export default LoanTxn;