import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/components/layout.css';
import Button from './Button';
import Header from './Header';
import { usertypes } from '../constants';
import { getLocalStorage } from '../utils/localstorage';
import { LocalStorageUserDetails } from '../types';

interface LayoutProps {
    children?: React.ReactNode;
}

const startPrediction = { name: 'Upload and run CSV data', url: '/dashboard', order: 1 };
const viewPrediction = { name: 'View previous predictions', url: '/predictions', order: 2 };
const resource = { name: 'Resources', url: '/resources', order: 3 };
const audit = { name: 'Audit trail', url: '/audit-logs', order: 4 };
const users = { name: 'Users', url: '/users', order: 5 };
const organisation = { name: 'Organisation/Trust', url: '/registered-organisations', order: 6 };

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
    const navigate = useNavigate();
    const currentMenu = [];
    const [showActionMenu, setShowActionMenu] = useState('');
    const [showCancelIcon, setshowCancelIcon] = useState(false);

    const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');

    if (userDetails.usertype === usertypes.admin) {
        currentMenu.push(startPrediction);
        currentMenu.push(resource);
        currentMenu.push(viewPrediction);
        currentMenu.push(audit);
        currentMenu.push(users);
    } else if (userDetails.usertype === usertypes.clinician) {
        currentMenu.push(startPrediction);
        currentMenu.push(resource);
        currentMenu.push(viewPrediction);
    } else if (userDetails.usertype === usertypes.superAdmin) {
        currentMenu.push(resource);
        currentMenu.push(viewPrediction);
        currentMenu.push(organisation);
        currentMenu.push(audit);
    }

    function outputEvent() {
        if (showActionMenu == 'showMenu') {
            setshowCancelIcon(false);
            setShowActionMenu('hideMenu');
        } else {
            setshowCancelIcon(true);
            setShowActionMenu('showMenu');
        }
    }

    currentMenu.sort((a: any, b: any) => a.order - b.order);

    return (
        <Fragment>
            <Header clickMenu={outputEvent} headerAuth={true} cancelIcon={showCancelIcon} />
            <div className='flex'>
                <div className={`side-bar side-bar-width ${showActionMenu}`}>
                    <div>
                        {
                            currentMenu.map((item: any) => {
                                return <div className='sidebar-btn' key={item.name}>
                                    <Button addClass={`secondary-btn ${window.location.pathname.includes(item.url) ? 'secondary-btn-active' : ''}`} text={item.name} onClick={() => { navigate(item.url); setShowActionMenu('hideMenu'); setshowCancelIcon(false); }} />
                                </div>;
                            })
                        }
                    </div>
                </div>
                <div className='main-content'>{children}</div>
            </div>
        </Fragment>
    );
};

export default Layout;
