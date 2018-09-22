import React, { Fragment } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { PAGINATION_CONFIG } from '../common/appconfig';

const OnetimeTable = (props) => {
    const onetimeData = props.onetimeData;

    const deleteHandler = (rowObj) => {
        props.deleteHandler(rowObj.fieldType, rowObj.fieldVal);
    }

    const actionFormatter = (cell, row) => {
        return (
            <Fragment>
                <button type="button" className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteHandler(row)}>Delete</button>
            </Fragment>
        )
    }

    return (
        <div className="row mt-4">
            <div className="col">
                <BootstrapTable data={onetimeData} version='4' pagination={true} options={PAGINATION_CONFIG}>
                    <TableHeaderColumn dataField='fieldType' dataSort>Field type</TableHeaderColumn>
                    <TableHeaderColumn isKey dataField='fieldVal' dataSort>Field value</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={actionFormatter}>Actions</TableHeaderColumn>
                </BootstrapTable>
            </div>
        </div>
    )
}

export default OnetimeTable;