import React, { Component } from 'react';

import { LOAN_CONFIG, SCREEN_NAME } from './loanconfig';
import { FormSection, HeaderSection, SubHeaderSection } from '../../component/common/elementwrapper';
import { createFormElems } from '../../component/common/utility';
import { validateRule } from '../../component/common/rule';
import LoanCard from '../../component/loan/loancard';
import { INPUT_TYPES } from '../../component/common/inputs';
import AsyncUtil from '../../component/common/ajaxutil';
import axios from 'axios';

class Loan extends Component {

    getPlainFormValues() {
        return {
            loanName: { value: '', errors: [] },
            loanDescription: { value: '', errors: [] },
            loanStartDate: { value: '', errors: [] },
            loanEndDate: { value: '', errors: [] },
            loanType: { value: '', errors: [] },
            loanAmount: { value: '', errors: [] },
            loanPeriod: { value: '', errors: [] },
            loanStatus: { value: '', errors: [] }
        }
    }

    state = {
        formElementValues: this.getPlainFormValues(),
        formUpdate: false,
        loanCards: []
    }

    formElementAttr = LOAN_CONFIG;

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
                this.setState({
                    formElementValues: {
                        ...plainState,
                        ...oneTimeStateObj
                    },
                    formUpdate: false,
                    loanCards: loanRes ? loanRes : []
                })
            }))
        } else {
            AsyncUtil.get('/loan/findAll', null, data => {
                const cardData = data ? data : [];
                this.setState({ formElementValues: { ...plainState }, formUpdate: false, loanCards: cardData })
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
            AsyncUtil.post('/loan/save', formValues, (data) => {
                Object.keys(this.state.formElementValues).forEach((key) => {
                    formElemState[key].value = '';
                });
                this.setState({
                    formElementValues: formElemState,
                    loanCards: data,
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

    loanUpdateHandler = (loanName) => {
        let loanCardsState = this.state.loanCards;
        let loanCardIndex = loanCardsState.findIndex(card => card.loanName === loanName);
        let loanCard = loanCardsState[loanCardIndex];
        let formElemState = {};
        let keys = Object.keys(loanCard);
        keys.forEach(key => {
            formElemState[key] = { ...this.state.formElementValues[key], errors: [] };
            formElemState[key].value = loanCard[key];
        });
        this.setState({
            formElementValues: formElemState,
            formUpdate: true
        });
    }

    loanDeleteHandler = (loanName) => {
        AsyncUtil.delete('/loan/delete/' + loanName, null, (data) => {
            this.setState({
                loanCards: data
            });
        });
    }

    render() {
        let loanCardItems = null;

        if (this.state.loanCards) {
            let loanCardsState = this.state.loanCards;
            loanCardItems = loanCardsState.map(card => {
                return <LoanCard card={card} key={card.loanName}
                    updateHandler={() => this.loanUpdateHandler(card.loanName)}
                    deleteHandler={() => this.loanDeleteHandler(card.loanName)}
                />
            });
        }

        let elemStateProps = new Map();
        elemStateProps.set('loanName', { disabled: this.state.formUpdate });

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
                <SubHeaderSection subHeaderName="Loans configured" />
                <div className="row mt-2">
                    {loanCardItems}
                </div>
            </FormSection>
        );
    }
}



export default Loan;