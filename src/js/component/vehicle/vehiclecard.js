import React from 'react';

const vehicleCard = (props) => {
    return (
        <div className="col-md-4 mb-3">
            <div className="card">
                <div className="card-header">
                    <strong>{props.card.vehicleName}</strong>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{props.card.vehicleNumber} ({props.card.vehicleStatus})</h5>                    
                    <p className="card-text">{props.card.vehicleCost}
                        <i className="fas fa-rupee-sign pl-1"></i> 
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

export default vehicleCard;