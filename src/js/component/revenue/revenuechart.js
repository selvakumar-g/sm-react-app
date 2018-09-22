import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

class RevenueChart extends Component {
    render() {
        const sortedDataMap = sortByDate(this.props.dataMap);
        const dataSetArr = createDataSet(sortedDataMap);
        let dataSets = [];
        dataSetArr.forEach((value, idx) => {
            dataSets.push(
                {
                    ...createColorProps(idx),
                    data: value,
                    label: idx
                }
            );
        })

        const data = {
            labels: Object.keys(ARR_POS),
            datasets: dataSets
        };

        const options = {
            tooltips: {
                mode: 'x',
                callbacks: {
                    title: (tooltipItemArr, data) => {
                        const ttItem = tooltipItemArr[0];
                        const ttData = sortedDataMap.get(ttItem['xLabel']);
                        if (ttData) {
                            const dataObj = ttData[ttItem['datasetIndex']];
                            if (dataObj)
                                return dataObj.transactionDate ? "     " + dataObj.transactionDate + "     " : "     " + ttItem['xLabel'] + "     ";
                            else
                                return '';
                        } else
                            return '';
                    },
                    beforeLabel: (ttItem, data) => {
                        const ttData = sortedDataMap.get(ttItem['xLabel']);
                        if (ttData) {
                            const dataObj = ttData[ttItem['datasetIndex']];
                            return dataObj ? ' Earning   ' + dataObj['earning'] : '';
                        } else
                            return '';
                    },
                    label: (ttItem, data) => {
                        const ttData = sortedDataMap.get(ttItem['xLabel']);
                        if (ttData) {
                            const dataObj = ttData[ttItem['datasetIndex']];
                            return dataObj ? 'Expense   ' + dataObj['expense'] : '';
                        } else
                            return '';
                    },
                    afterLabel: (ttItem, data) => {
                        const ttData = sortedDataMap.get(ttItem['xLabel']);
                        if (ttData) {
                            const dataObj = ttData[ttItem['datasetIndex']];
                            return dataObj ? '      Gain   ' + dataObj['gain'] : '';
                        } else
                            return '';
                    },
                    beforeFooter: () => ''
                },
                responsive: true,
                maintainAspectRatio: false,
                backgroundColor: '#2d3033',
                titleFontSize: 16,
                titleMarginBottom: 4,
                bodyFontColor: '#00b4f0',
                bodyFontSize: 14,
                borderWidth: 0,
                displayColors: false,
                xPadding: 5,
                yPadding: 5,
                bodySpacing: 0
            }
        }
        return (
            <div className="d-flex justify-content-center w-100">
                <div className="chart-container position-relative" style={{ width: '95%' }}>
                    <Bar
                        data={data}
                        options={options}
                        legend={{ display: false }}
                        {...this.props}
                    />
                </div>
            </div>
        )
    }
}

const createDataSet = (dataMap) => {
    const emptyArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dataSetArr = [];
    for (let [key, value] of dataMap.entries()) {
        for (let idx = 0; idx < value.length; idx++) {
            if ((dataSetArr.length - 1) < idx) {
                dataSetArr[idx] = emptyArr.slice(0);
            }
            dataSetArr[idx][ARR_POS[key]] = value[idx]['gain'];
        }
    }
    return dataSetArr;
}

const sortByDate = (dataMap) => {
    for (let value of dataMap.values()) {
        value.sort((val1, val2) => {
            return (val1.transactionDate < val2.transactionDate) ?
                -1 : ((val1.transactionDate > val2.transactionDate) ? 1 : 0);
        })
    }
    return dataMap;
}

const ARR_POS = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
}

const COL_POS = {
    0: 'rgb(96, 189, 104)',
    1: 'rgb(222, 207, 63)',
    2: 'rgb(252, 104, 104)',
    3: 'rgb(250, 164, 58)',
    4: 'rgb(74, 181, 235)',
    
}

const createColorProps = (index) => {
    const idx = index % 5;
    return {
        backgroundColor: COL_POS[idx],
        borderColor: COL_POS[idx],
        borderWidth: 1,
        hoverBackgroundColor: COL_POS[idx],
        hoverBorderColor: COL_POS[idx]
    }
}
export default RevenueChart;