import React, { Component, Fragment } from 'react';


import { FormSection, HeaderSection, SubHeaderSection, ElementWrapper } from '../../component/common/elementwrapper';
import { SelectElem } from '../../component/common/inputs';
import RevenueChart from '../../component/revenue/revenuechart'

import AsyncUtil from '../../component/common/ajaxutil';


class Revenue extends Component {

    state = {
        vehicleName: { value: '', errors: [] },
        year: { value: '', errors: [] },
        revenueData: {}
    }

    componentDidMount() {
        AsyncUtil.get('vehicle/findAll', null, data => {
            if (data) {
                let vehicleOTValues = data.map(vehicleVal => {
                    return {
                        value: vehicleVal.vehicleName, text: vehicleVal.vehicleName
                    }
                });
                this.setState({
                    vehicleName: {
                        ...this.state.vehicleName,
                        options: vehicleOTValues
                    }
                })
            }
        });
    }

    onChangeHandler = (event) => {
        if (event.target.name === 'vehicleName') {
            let vehicleObj = { ...this.state.vehicleName };
            if (event.target.value) {
                vehicleObj.value = event.target.value
                AsyncUtil.get('/revenue/findRevenueForVehicle/' + vehicleObj.value, null, (resData) => {
                    let yearValues = Object.keys(resData.transactions).map(key => {
                        return {
                            value: key, text: key
                        }
                    });
                    this.setState({
                        vehicleName: vehicleObj,
                        year: { ...this.state.year, value: '', options: yearValues },
                        revenueData: resData.transactions
                    });
                });
            } else {
                vehicleObj.value = ''
                this.setState({
                    vehicleName: vehicleObj,
                    year: { ...this.state.year, value: '', options: [] },
                    revenueData: {}
                });
            }
        } else if (event.target.name === 'year') {
            this.setState({
                year: { ...this.state.year, value: event.target.value }
            });
        }
    }

    formAttr = {
        vehicleName: {
            name: "vehicleName", label: 'Vehicle name', placeholder: 'Select vehicle name',
            options: [],
            onChangeHandler: this.onChangeHandler
        }, year: {
            name: "year", label: 'year', placeholder: 'Select year',
            options: [],
            onChangeHandler: this.onChangeHandler
        }
    }

    render() {
        let yearlyChart = null, monthlyChart = null;
        if (this.state.year.value) {
            const dataMapAll = computeByMonth(this.state.revenueData[this.state.year.value].byAll);
            yearlyChart = (
                <Fragment>
                    <SubHeaderSection subHeaderName="Yearly" />
                    <RevenueChart dataMap={dataMapAll} width={100} height={25} />
                </Fragment>
            );

            const dataMapMonth = computeByMonth(this.state.revenueData[this.state.year.value].byMonth);
            monthlyChart = (
                <Fragment>
                    <SubHeaderSection subHeaderName="Monthly" />
                    <RevenueChart dataMap={dataMapMonth} width={100} height={25} />
                </Fragment>
            );
        }
        return (
            <FormSection>
                <HeaderSection headerName="Revenue" />
                <div className="row">
                    <ElementWrapper>
                        <SelectElem formAttr={this.formAttr.vehicleName}
                            stateAttr={this.state.vehicleName}
                            onChangeHandler={this.onChangeHandler} />
                    </ElementWrapper>
                    <ElementWrapper>
                        <SelectElem formAttr={this.formAttr.year}
                            stateAttr={this.state.year}
                            onChangeHandler={this.onChangeHandler} />
                    </ElementWrapper>
                </div>
                {yearlyChart}
                {monthlyChart}
            </FormSection>
        );
    }
}

const computeByMonth = (dataArr) => {
    let dataMap = new Map();
    dataArr.forEach(element => {
        let objArr = dataMap.has(element.transactionMonth) ? dataMap.get(element.transactionMonth) : [];
        objArr.push(element);
        if (!dataMap.has(element.transactionMonth))
            dataMap.set(element.transactionMonth, objArr);
    });

    return dataMap;
}

export default Revenue;