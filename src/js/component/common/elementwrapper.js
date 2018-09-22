import React from 'react';

export const FormSection = (props) => {
    return (
        <div className="container">
            <form>
                {props.children}
            </form>
        </div>
    );
}

export const HeaderSection = (props) => {
    return (
        <div className="row pb-4">
            <div className="col">
                <div className="border-bottom border-bottom-w3">
                    <h3 className="pb-2">{props.headerName}</h3>
                </div>
            </div>
        </div>
    )
}

export const SubHeaderSection = (props) => {
    return (
        <div className="row pb-4 pt-4">
            <div className="col">
                <div className="border-bottom">
                    <h5 className="pb-2">{props.subHeaderName}</h5>
                </div>
            </div>
        </div>
    )
}

export const ElementWrapper = (props) => {
    return (
        <div className="col-lg-4 mb-3"  {...props}>
            <div className="form-group">
                {props.children}
            </div>
        </div>
    )
}