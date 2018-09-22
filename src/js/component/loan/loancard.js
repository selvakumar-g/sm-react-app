import React from 'react';

const menucard = (props) => {
    return (
        <div className="col-lg-4 mb-3">
            <div className="card">
                <div className="card-header">
                    <strong>{props.card.loanName}</strong>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{props.card.loanType} ({props.card.loanStatus})</h5>
                    <p className="card-text">{props.card.loanStartDate}</p>
                    <p className="card-text">{props.card.loanAmount}
                        <i className="fa fa-inr pl-1"></i> ({props.card.loanPeriod + " months"})
                    </p>
                    <button type="button" className="btn btn-sm btn-outline-secondary mr-2"
                        onClick={props.updateHandler}>Update</button>
                    <button type="button" className="btn btn-sm btn-outline-danger"
                        onClick={props.deleteHandler}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default menucard;