import React, { Component } from 'react';

import { VEHICLE_CONFIG, SCREEN_NAME } from './vehicleconfig';
import { FormSection, HeaderSection, SubHeaderSection } from '../../component/common/elementwrapper';
import { createFormElems } from '../../component/common/utility';
import { validateRule } from '../../component/common/rule';
import VehicleCard from '../../component/vehicle/vehiclecard';
import { INPUT_TYPES } from '../../component/common/inputs';
import AsyncUtil from '../../component/common/ajaxutil';
import axios from 'axios';

class Vehicle extends Component {

  getPlainFormValues() {
    return {
      vehicleName: { value: '', errors: [] },
      vehicleNumber: { value: '', errors: [] },
      vehicleType: { value: '', errors: [] },
      vehicleStatus: { value: '', errors: [] },
      vehicleCost: { value: '', errors: [] },
      investment: { value: '', errors: [] },
      vehicleLoans: { value: '', errors: [] }
    }
  }

  state = {
    formElementValues: this.getPlainFormValues(),
    formUpdate: false,
    vehicleCards: []
  }

  formElementAttr = VEHICLE_CONFIG;

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
      let values = Array.from(oneTimeVarMap.values()).join(',');
      axios.all([
        axios.get('/onetime/findOneTimes/' + values),
        axios.get('/loan/findAll'),
        axios.get('/vehicle/findAll')
      ]).then(axios.spread((oneTimePromise, loanPromise, vehiclePromise) => {
        let oneTimeRes = oneTimePromise.data.details, loanRes = loanPromise.data.details,
          vehicleRes = vehiclePromise.data.details;
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
        const vehicleCardsObj = vehicleRes ? vehicleRes : [];
        let loanOTValues = loanRes ? loanRes.map(loanVal => {
          return {
            value: loanVal.loanName, text: loanVal.loanName
          }
        }) : [];
        this.setState({
          formElementValues: {
            ...plainState,
            ...oneTimeStateObj,
            vehicleLoans: {
              ...plainState['vehicleLoans'],
              options: loanOTValues
            }
          },
          formUpdate: false,
          vehicleCards: vehicleCardsObj
        })
      }));
    } else {
      axios.all([
        axios.get('/loan/findAll'),
        axios.get('/vehicle/findAll')
      ]).then(axios.spread((loanPromise, vehiclePromise) => {
        let loanRes = loanPromise.data.details, vehicleRes = vehiclePromise.data.details;
        const vehicleCardsObj = vehicleRes ? vehicleRes : [];
        let loanOTValues = loanRes ? loanRes.map(loanVal => {
          return {
            value: loanVal.loanName, text: loanVal.loanName
          }
        }) : [];
        this.setState({
          formElementValues: {
            ...plainState,
            vehicleLoans: {
              ...plainState['vehicleLoans'],
              options: loanOTValues
            }
          },
          formUpdate: false,
          vehicleCards: vehicleCardsObj
        })
      }));
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
      AsyncUtil.post('/vehicle/save', formValues, (data) => {
        Object.keys(this.state.formElementValues).forEach((key) => {
          formElemState[key].value = '';
        });
        this.setState({
          formElementValues: formElemState,
          vehicleCards: data,
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

  vehicleUpdateHandler = (vehicleName) => {
    let vehicleCardsState = this.state.vehicleCards;
    let vehicleCardIndex = vehicleCardsState.findIndex(card => card.vehicleName === vehicleName);
    let vehicleCard = vehicleCardsState[vehicleCardIndex];
    let formElemState = {};
    let keys = Object.keys(vehicleCard);
    keys.forEach(key => {
      formElemState[key] = { ...this.state.formElementValues[key], errors: [] };
      formElemState[key].value = vehicleCard[key];
    });
    this.setState({
      formElementValues: formElemState,
      formUpdate: true
    });
  }

  vehicleDeleteHandler = (vehicleName) => {
    AsyncUtil.delete('/vehicle/delete/' + vehicleName, null, (data) => {
      this.setState({
        vehicleCards: data
      });
    });
  }

  render() {
    let vehicleCardItems = null;

    if (this.state.vehicleCards) {
      let vehicleCardsState = this.state.vehicleCards;
      vehicleCardItems = vehicleCardsState.map(card => {
        return <VehicleCard card={card} key={card.vehicleName}
          updateHandler={() => this.vehicleUpdateHandler(card.vehicleName)}
          deleteHandler={() => this.vehicleDeleteHandler(card.vehicleName)}
        />;
      });
    }

    let elemStateProps = new Map();
    elemStateProps.set('name', { disabled: this.state.formUpdate });

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
        <SubHeaderSection subHeaderName="Vehicles configured" />
        <div className="row mt-4">
          {vehicleCardItems}
        </div>
      </FormSection>
    );
  }
}



export default Vehicle;