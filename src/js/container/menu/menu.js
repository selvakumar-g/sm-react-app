import React, { Fragment } from 'react';
import MenuLink from '../../component/menu/menulink'
import { APP_NAME } from '../../component/common/appconfig'

const menu = (props) => {
    return (
        <Fragment>
            <nav className="sidebar">
                <div className="pt-4 pb-4 d-flex justify-content-center">
                    <h2>{APP_NAME}</h2>
                </div>
                <div>
                    <MenuLink {...props} />
                </div>
            </nav>
        </Fragment>
    )
}

export default menu;