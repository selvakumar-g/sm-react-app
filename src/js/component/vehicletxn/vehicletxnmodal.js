import React, { Component } from 'react';
import Modal from 'react-modal';
import { Rules } from '../common/rule';
import { ElementWrapper, HeaderSection, SubHeaderSection } from '../common/elementwrapper';
import { INPUT_TYPES } from '../common/inputs';
import { createElement } from '../common/utility';
import { validateRule } from '../../component/common/rule';
import { MODAL_STYLE_CONFIG } from '../common/appconfig';
import AsyncUtil from '../../component/common/ajaxutil';

class VehicleTxnModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.showModal,
            mainValues: {},
            rowValues: [],
            transactionAttributes: []
        }
    }

    getStatePlainValues = (inputType, rules, label, placeholder) => {
        return {
            value: '',
            errors: [],
            type: inputType,
            rules: rules ? rules : [],
            label: label ? label : '',
            placeholder: placeholder ? placeholder : ''
        }
    }

    createRowValue = (transactionAttributes, txnAttrValue, index) => {
        return {
            transactionAttribute: {
                ...this.getStatePlainValues(INPUT_TYPES.SELECT, { [Rules.MANDATORY]: 'Txn attribute cannot be empty' }, null, 'Select trasaction attribute'),
                value: txnAttrValue, index: index, options: transactionAttributes
            },
            amount: { ...this.getStatePlainValues(INPUT_TYPES.INPUT, { [Rules.MANDATORY]: 'Amount should be number and not zero' }, null, 'Enter amount'), value: '', index: index },
            remarks: { ...this.getStatePlainValues(INPUT_TYPES.INPUT, null, null, 'Enter remarks'), value: '', index: index }
        }
    }

    createMainValues = (vehicleNames) => {
        return {
            vehicleName: {
                ...this.getStatePlainValues(INPUT_TYPES.SELECT, { [Rules.MANDATORY]: 'Vehicle name cannot be empty' }, 'Vehicle Name', 'Enter vehicle name'),
                options: vehicleNames ? vehicleNames : []
            },
            transactionDate: this.getStatePlainValues(INPUT_TYPES.DAYPICKER, { [Rules.MANDATORY]: 'Txn date cannot be empty' }, 'Transaction date', 'Enter transaction date')
        };

    }

    createRowValues = (transactionAttributes) => {
        let rowValues = [];
        if (transactionAttributes) {
            transactionAttributes.forEach((value, index) => {
                rowValues.push(this.createRowValue(transactionAttributes, value.value, index));
            })
        }
        return rowValues;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.transactionAttributes &&
            this.state.transactionAttributes.length !== newProps.transactionAttributes.length) {
            this.setState({
                showModal: newProps.showModal,
                transactionAttributes: newProps.transactionAttributes,
                mainValues: this.createMainValues(newProps.vehicleNames),
                rowValues: this.createRowValues(newProps.transactionAttributes),
                vehicleNames: newProps.vehicleNames
            })
        } else
            this.setState({
                showModal: newProps.showModal
            })
    }

    mainValueOnChangeHandler = (event) => {
        this.setState({
            mainValues: {
                ...this.state.mainValues,
                [event.target.name]: {
                    ...this.state.mainValues[event.target.name],
                    value: event.target.value
                }
            }
        })
    }

    createElemObj = (name, stateObj, onChangeHandler, dataProps) => {
        return {
            formAttr: { label: stateObj.label, name: name, placeholder: stateObj.placeholder, options: stateObj.options },
            stateAttr: { errors: stateObj.errors, value: stateObj.value },
            onChangeHandler: onChangeHandler,
            dataProps: dataProps
        }
    }

    createMainValueComponents = () => {
        let comps = [];
        if (this.state.mainValues) {
            Object.keys(this.state.mainValues).forEach((key, index) => {
                const obj = this.state.mainValues[key];
                const component = createElement(obj.type, this.createElemObj(key, obj, this.mainValueOnChangeHandler));
                comps.push(
                    <ElementWrapper key={index}>
                        {component}
                    </ElementWrapper>
                )
            });
        }
        return comps.length ? comps : null;
    }

    rowValueOnChangeHandler = (event) => {
        const index = event.target.getAttribute('data-rowindex');
        let rows = [...this.state.rowValues];
        let obj = { ...rows[index] };
        obj[event.target.name].value = event.target.value;
        rows.splice(index, 1, obj);
        this.setState({
            rowValues: rows
        });
    }

    rowDeleteHandler = (index) => {
        let rows = [...this.state.rowValues];
        rows.splice(index, 1);
        this.setState({
            rowValues: rows
        })
    }

    rowAddHandler = () => {
        let rows = [...this.state.rowValues];
        rows.push(this.createRowValue(this.props.transactionAttributes, '', rows.length));
        this.setState({
            rowValues: rows
        })

    }

    createRowValueComponents = () => {
        let comps = [];
        if (this.state.rowValues) {
            this.state.rowValues.forEach((rowObj, index) => {
                let rowComps = [];
                Object.keys(rowObj).forEach((key, subIndex) => {
                    const obj = rowObj[key];
                    const component = createElement(obj.type, this.createElemObj(key, obj, this.rowValueOnChangeHandler, { 'data-rowindex': index }));
                    let deleteIcon = key === 'remarks' ? <i className="fa fa-trash-o mt-3 deleteIcon" onClick={() => this.rowDeleteHandler(index)}></i> : null;

                    let addIcon = (this.state.rowValues.length === index + 1 &&
                        key === 'remarks') ? <i className="fa fa-plus mt-3 addIcon" onClick={this.rowAddHandler}></i> : null;
                    rowComps.push(
                        <ElementWrapper key={subIndex} className="col-md-3 position-relative">
                            {component}
                            {deleteIcon}
                            {addIcon}
                        </ElementWrapper>
                    )
                })
                comps.push(
                    <div className="row d-flex justify-content-center" key={index}>
                        {rowComps}
                    </div>
                )
            });
        }
        return comps.length ? comps : null;
    }



    validateForm = (formElemState) => {
        let keys = Object.keys(formElemState);
        let isFormValid = true;
        keys.forEach((key) => {
            if (formElemState[key].errors.length)
                formElemState[key].errors.splice(0, formElemState[key].errors.length);
            let value = formElemState[key].value;
            let rules = formElemState[key].rules;
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
        let mainVal = { ...this.state.mainValues };
        const mainValsValid = this.validateForm(mainVal);
        let rows = [...this.state.rowValues];
        let rowValsValid = true;
        rows.forEach(rowVal => {
            const isValid = this.validateForm(rowVal);
            if (!isValid)
                rowValsValid = isValid;
        })
        if (mainValsValid && rowValsValid) {
            const serverData = this.createServerReqObjects();
            AsyncUtil.post('/vehicle_txn/batch', serverData, () => {
                this.setState({
                    mainValues: this.createMainValues(this.state.vehicleNames),
                    rowValues: this.createRowValues(this.state.transactionAttributes),
                })
            });
        } else {
            this.setState({
                mainValues: mainVal,
                rowValues: rows
            })
        }
    }

    resetHandler = () => {
        this.setState({
            mainValues: this.createMainValues(this.state.vehicleNames),
            rowValues: this.createRowValues(this.state.transactionAttributes),
        })
    }

    createServerReqObjects = () => {
        let serverObjects = []
        let mainValObj = {}
        Object.keys(this.state.mainValues).forEach(key => {
            mainValObj[key] = this.state.mainValues[key].value;
        })
        this.state.rowValues.forEach(rowObj => {
            let obj = { ...mainValObj }
            Object.keys(rowObj).forEach(key => {
                obj[key] = rowObj[key].value;
            });
            serverObjects.push(obj);
        })
        return serverObjects;
    }

    render() {
        let mainValueComponent = this.createMainValueComponents();
        let rowValueComponent = this.createRowValueComponents();
        return (
            <Modal
                isOpen={this.state.showModal}
                style={MODAL_STYLE_CONFIG}
                contentLabel="Vehicle txn modal" ariaHideApp={false} >
                <div className="p-3">
                    <HeaderSection headerName="Capture transactions" />
                    <div className="row">
                        {mainValueComponent}
                    </div>
                    <SubHeaderSection subHeaderName="Transaction details" />
                    {rowValueComponent}
                    <div className="row d-flex justify-content-end mt-3">
                        <div className="mr-4">
                            <button type="button" className="btn btn-info" onClick={this.saveHandler}>Save</button>
                        </div>
                        <div className="mr-4">
                            <button type="button" className="btn btn-default" onClick={this.resetHandler}>Reset</button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-secondary" onClick={this.props.closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default VehicleTxnModal;