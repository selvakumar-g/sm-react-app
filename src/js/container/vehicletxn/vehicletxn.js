import React, { Component } from 'react';

import { VEHICLE_TXN_CONFIG, SCREEN_NAME } from './vehicletxnconfig';
import { FormSection, HeaderSection, SubHeaderSection } from '../../component/common/elementwrapper';
import { createFormElems } from '../../component/common/utility';
import { validateRule } from '../../component/common/rule';
import VehicleTxnTable from '../../component/vehicletxn/vehicletxntable'

import { INPUT_TYPES } from '../../component/common/inputs';
import AsyncUtil from '../../component/common/ajaxutil';
import axios from 'axios';
import VehicleTxnModal from '../../component/vehicletxn/vehicletxnmodal';

class VehicleTxn extends Component {

    getPlainFormValues() {
        return {
            vehicleName: { value: '', errors: [] },
            sequenceNumber: { value: '', errors: [] },
            transactionDate: { value: '', errors: [] },
            transactionAttribute: { value: '', errors: [] },
            amount: { value: '', errors: [] },
            remarks: { value: '', errors: [] }
        }
    }
    state = {
        formElementValues: this.getPlainFormValues(),
        formUpdate: false,
        vehicleTxnCaptured: [],
        showModal: false
    }

    formElementAttr = VEHICLE_TXN_CONFIG;

    componentDidMount() {
        this.initialize();
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
                axios.get('/vehicle/findAll')
            ]).then(axios.spread((oneTimePromise, vehiclePromise) => {
                let oneTimeRes = oneTimePromise.data.details, vehicleRes = vehiclePromise.data.details;
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
                let vehicleOTValues = vehicleRes ? vehicleRes.map(vehicleVal => {
                    return {
                        value: vehicleVal.vehicleName, text: vehicleVal.vehicleName
                    }
                }) : [];
                this.setState({
                    formElementValues: {
                        ...plainState,
                        ...oneTimeStateObj,
                        vehicleName: {
                            ...plainState.vehicleName,
                            options: vehicleOTValues
                        }
                    },
                    formUpdate: false,
                    vehicleTxnCaptured: []
                })
            }));
        } else {
            AsyncUtil.get('vehicle/findAll', null, data => {
                let vehicleOTValues = data ? data.map(vehicleVal => {
                    return {
                        value: vehicleVal.vehicleName, text: vehicleVal.vehicleName
                    }
                }) : [];
                this.setState({
                    formElementValues: {
                        ...plainState,
                        vehicleName: {
                            ...plainState.vehicleName,
                            options: vehicleOTValues
                        }
                    },
                    formUpdate: false, vehicleTxnCaptured: []
                })

            });
        }
    }

    fetchTxnAndUpdateState = () => {
        const vehicleName = this.state.formElementValues.vehicleName.value;
        const txnDate = this.state.formElementValues.transactionDate.value;
        if (vehicleName) {
            let url = '/vehicle_txn/findVehicleTxn/'+vehicleName;
            url = txnDate ? url + '/' + txnDate : url;
            AsyncUtil.get( url, null, (data) => {
                this.setState({
                    vehicleTxnCaptured: data ? data : []
                });
            });
        } else if (this.state.vehicleTxnCaptured)
            this.setState({
                vehicleTxnCaptured: []
            });

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

        if (event.target.name === 'vehicleName' || event.target.name === 'transactionDate') {
            this.fetchTxnAndUpdateState();
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
            AsyncUtil.post('/vehicle_txn/save', formValues, (data) => {
                Object.keys(this.state.formElementValues).forEach((key) => {
                    formElemState[key].value = '';
                });
                this.setState({
                    formElementValues: formElemState,
                    vehicleTxnCaptured: data,
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

    vehicleTxnUpdateHandler = (vehicleName, sequenceNumber) => {
        let vehicleTxnCapturedState = this.state.vehicleTxnCaptured;
        let vehicleTxnCardIndex = vehicleTxnCapturedState.findIndex(txn =>
            (txn.vehicleName === vehicleName && txn.sequenceNumber === sequenceNumber));
        let vehicleTxn = vehicleTxnCapturedState[vehicleTxnCardIndex];
        let formElemState = {};
        let keys = Object.keys(vehicleTxn);
        keys.forEach(key => {
            formElemState[key] = { ...this.state.formElementValues[key], errors: [] };
            formElemState[key].value = vehicleTxn[key];
        });

        this.setState({
            formElementValues: formElemState,
            formUpdate: true
        });
    }

    vehicleTxnDeleteHandler = (vehicleName, sequenceNumber) => {
        AsyncUtil.delete('/vehicle_txn/delete/' + vehicleName + '/' + sequenceNumber, null, (data) => {
            this.fetchTxnAndUpdateState();
        });
    }

    render() {
        let elemStateProps = new Map();
        elemStateProps.set('vehicleName', { disabled: this.state.formUpdate });

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
                            <button type="button" className="btn btn-info"
                                onClick={this.saveHandler}>Save</button>
                        </div>
                        <div className="mr-4">
                            <button type="button" className="btn btn-warning"
                                onClick={() => this.setState({ showModal: true })}>Bulk capture</button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-secondary"
                                onClick={this.resetHandler} >Reset</button>
                        </div>
                    </div>
                </div>
                <SubHeaderSection subHeaderName="Vehicle transactions captured" />
                <VehicleTxnTable vehicleTxnData={this.state.vehicleTxnCaptured}
                    updateHandler={this.vehicleTxnUpdateHandler} deleteHandler={this.vehicleTxnDeleteHandler} />
                <VehicleTxnModal showModal={this.state.showModal} 
                vehicleNames={this.state.formElementValues.vehicleName.options}
                transactionAttributes={this.state.formElementValues.transactionAttribute.options} 
                closeModal={() => this.setState({showModal: false})}/>
            </FormSection>
        );
    }
}

export default VehicleTxn;