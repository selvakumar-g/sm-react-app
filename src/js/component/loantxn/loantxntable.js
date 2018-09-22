import React, { Fragment } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


import { PAGINATION_CONFIG } from '../common/appconfig';

const LoanTxnTable = (props) => {
    const loanTxnData = props.loanTxnData;

    const updateHandler = (rowObj) => {
        props.updateHandler(rowObj.loanName, rowObj.sequenceNumber);
    }

    const deleteHandler = (rowObj) => {
        props.deleteHandler(rowObj.loanName, rowObj.sequenceNumber);
    }

    const actionFormatter = (cell, row) => {
        return (
            <Fragment>
                <button type="button" className="btn btn-sm mr-2 btn-outline-success" onClick={() => updateHandler(row)}>Update</button>
                <button type="button" className="btn btn-sm mr-2 btn-outline-danger" onClick={() => deleteHandler(row)}>Delete</button>
            </Fragment>
        )
    }

    return (
        <div className="row mt-4">
            <div className="col">
                <BootstrapTable data={loanTxnData} version='4' pagination={true} options={PAGINATION_CONFIG}>
                    <TableHeaderColumn dataField='loanName'>Loan name</TableHeaderColumn>
                    <TableHeaderColumn isKey dataField='sequenceNumber' hidden>Sequence number</TableHeaderColumn>
                    <TableHeaderColumn dataField='transactionDate' dataSort >Transaction date</TableHeaderColumn>
                    <TableHeaderColumn dataField='transactionType' dataSort >Transaction type</TableHeaderColumn>
                    <TableHeaderColumn dataField='amount' dataSort >Amount</TableHeaderColumn>
                    <TableHeaderColumn dataField='remarks'>Remarks</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={actionFormatter}>Actions</TableHeaderColumn>
                </BootstrapTable>
            </div>
        </div>
    )
}

export default LoanTxnTable;