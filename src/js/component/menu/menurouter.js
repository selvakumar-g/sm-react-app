import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { MENU_CONFIG, MENU_MAPPING } from '../common/appconfig'
//TO-DO
import Loan from '../../container/loan/loan';
import LoanTxn from '../../container/loantxn/loantxn';
import Vehicle from '../../container/vehicle/vehicle';
import VehicleTxn from '../../container/vehicletxn/vehicletxn';
import Revenue from '../../container/revenue/revenue';
import Onetime from '../../container/onetime/onetime';


const getCompAbsPath = (name) => {
    switch (name) {
        case MENU_MAPPING.Loan:
            return '../../container/loan/loan';
        case MENU_MAPPING.LoanTxn:
            return '../../container/loantxn/loantxn';
        case MENU_MAPPING.Vehicle:
            return '../../container/vehicle/vehicle';
        case MENU_MAPPING.VehicleTxn:
            return '../../container/vehicletxn/vehicletxn';
        case MENU_MAPPING.Revenue:
            return '../../container/revenue/revenue';
        case MENU_MAPPING.Onetime:
            return '../../container/onetime/onetime';
        default:
            return null;
    }
}



const TempComponent = (compFun) => {
    return class extends Component {

        state = {
            routeComponent: null
        }

        componentDidMount() {
            compFun().then(comp => {
                this.setState({ routeComponent: comp.default });
            })
        }

        render() {
            let RouteComponent = this.state.routeComponent;
            return RouteComponent ? <RouteComponent {...this.props} /> : null;
        }
    }
}


const getRoute = (name, path, compName) => {
    // let compAbsPath = getCompAbsPath(compName);    
    //const InitComponent = TempComponent(() => {
    //  return import(compAbsPath);
    //   })
    //Change it to InitComponent


    if (compName === MENU_MAPPING.Loan)
        return <Route path={path} exact key={name} component={Loan} />
    else if (compName === MENU_MAPPING.LoanTxn)
        return <Route path={path} exact key={name} component={LoanTxn} />
    else if (compName === MENU_MAPPING.Vehicle)
        return <Route path={path} exact key={name} component={Vehicle} />
    else if (compName === MENU_MAPPING.VehicleTxn)
        return <Route path={path} exact key={name} component={VehicleTxn} />
    else if (compName === MENU_MAPPING.Revenue)
        return <Route path={path} exact key={name} component={Revenue} />
    else if (compName === MENU_MAPPING.Onetime)
        return <Route path={path} exact key={name} component={Onetime} />
}

const menurouter = (props) => {



    /*let routers = props.menuParams.map(menuParam => {
        if (menuParam.path) {
            return getRoute(menuParam.title, menuParam.path, menuParam.componentName);
        } else if (menuParam.subLink) {
            return menuParam.subLink.map(subMenuParam => getRoute(subMenuParam.title, subMenuParam.path, subMenuParam.componentName));
        }
        return null;
    });*/

    return (
        <Switch>
            {MENU_CONFIG.reduce((holder, menuParam) => {
                if (menuParam.isRoot)
                    holder.push(getRoute(menuParam.title, '/', menuParam.componentName));
                holder.push(getRoute(menuParam.title, menuParam.path, menuParam.componentName));
                return holder;
            }, [])}
        </Switch>
    );
}



export default menurouter;