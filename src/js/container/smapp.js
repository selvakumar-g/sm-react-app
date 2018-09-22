import React, { Component, Fragment } from 'react';

import Menu from './menu/menu';
import MenuRouter from '../component/menu/menurouter';
import { APP_NAME } from '../component/common/appconfig'

class SMApp extends Component {
    state = {
        showMenu: false
    }

    menuInvokeHandler = () => {
        this.setState({
            showMenu: true
        })
    }

    menuDiscardHandler = () => {
        this.setState({
            showMenu: false
        })
    }

    render() {
        const menuClass = this.state.showMenu ? 'show-menu' : '';
        return (
            <Fragment>
                <section className={menuClass}>
                    <div className="menu-mask" onClick={this.menuDiscardHandler}></div>
                    <Menu navLinkClickHandler={this.menuDiscardHandler} />
                    <div className="appHeader">
                        <div className="container d-flex">
                            <div className="flex-grow-1">
                                <h2>{APP_NAME}</h2>
                            </div>
                            <div>
                                <i className="fa fa-bars fa-2x" onClick={this.menuInvokeHandler}></i>
                            </div>
                        </div>
                        <div className="async-progress"></div>
                    </div>
                    
                    <MenuRouter />
                </section>
            </Fragment>
        )
    }
}

export default SMApp;
