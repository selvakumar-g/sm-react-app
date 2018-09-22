import React from 'react';
import { NavLink } from 'react-router-dom';
import { MENU_CONFIG } from '../common/appconfig';

const MenuLink = (props) => {
    return (
        <ul>
            {MENU_CONFIG.map(config => {
                return (
                    <li key={config.title}>
                        <NavLink to={config.path} className="menu-link" onClick={props.navLinkClickHandler}>
                            <div className="menuIcon">
                                <i className={config.iconClass}></i>
                            </div>
                            <div className="menuContent">
                                <span className="menuTitle">{config.title}</span>
                            </div>
                        </NavLink>
                    </li>
                )
            })}
        </ul>
    );
}

export default MenuLink;