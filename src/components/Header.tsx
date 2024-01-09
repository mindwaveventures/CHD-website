import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import logo from '../assets/images/logo.png';
import profile from '../assets/images/Profileicon.svg';
import '../style/components/header.css';
import Popup from './Popup';
import { getLocalStorage, capitalizeFirstLetter } from '../utils';
import { LocalStorageUserDetails } from '../types';
import { ReactComponent as Menuicon } from '../assets/images/Menu.svg';
import { ReactComponent as Closeicon } from '../assets/images/close.svg';
import { usertypes, getUserType } from '../constants';
import { logout } from '../services';

export interface HeaderProps {
    text?: string;
    clickMenu?: (e: any) => void;
    headerAuth?: boolean;
    cancelIcon?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
    const userData: LocalStorageUserDetails = getLocalStorage('userDetails');
    const { instance } = useMsal();

    const wrapperRef: any = useRef(null);

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState('');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: userData?.name || ''
    });

    const localStorageListener = () => {
        const data = getLocalStorage('userDetails');
        setUserDetails({
            name: data?.name || '',
        });
    };

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        // Listen for storage event change
        window.addEventListener('storage', localStorageListener);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('storage', localStorageListener);
        };
    }, [wrapperRef]);

    const path = window.location.pathname;

    return (
        <div className='primary-header'>

            <div className={props.headerAuth ? 'header-logo' : 'auth-header'}>
                <img src={logo} alt='Alderhey' onClick={() => {
                    navigate('/');
                }}></img>
                {props.headerAuth && <span className='hidden' onClick={props.clickMenu}>
                    {!props.cancelIcon ? <Menuicon /> : <Closeicon />
                    }
                </span>}
            </div>
            {props.headerAuth &&
                <div className='secondary-header'>
                    <h1 className='h1-text'>{userData.trustName || ''}</h1>
                    <div>
                        <div className='account-blk'>
                            <div>
                                <p>{capitalizeFirstLetter(userDetails.name) || ''}</p>
                                <p>{userData.usertype ? getUserType(userData.usertype) : ''}</p>
                            </div>
                            <div className={`p-0.5 ${path === '/profile' || path === '/account' ? 'active-profile' : 'inactive-profile'}`} ref={wrapperRef}>
                                <img src={profile} alt='profile' onClick={() => setShowProfileDropdown(!showProfileDropdown)} aria-hidden="true"></img>
                                {(showProfileDropdown) &&
                                    <div>
                                        <div className='menu-dropdown'></div>
                                        <div>
                                            <div className='sub-menu-dropdown' onClick={() => {
                                                setShowProfileDropdown(false);
                                            }}>
                                                <div onClick={() => navigate('/profile')}>Profile</div>
                                                {userData.usertype !== usertypes.superAdmin && <div onClick={() => navigate('/account')}>Account</div>}
                                                <div onClick={() => setShowMenu('logout')}>Logout</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            {(showMenu === 'logout') &&
                <Popup
                    addClass='h-250'
                    headerText='Are you sure, you would like to logout ?'
                    btnText='OK'
                    onBtnClick={async () => {
                        await logout();
                        const adLogin = getLocalStorage('adlogin');
                        localStorage.clear();
                        if (adLogin) {
                            await instance.logoutPopup({
                                postLogoutRedirectUri: process.env.REACT_APP_AD_REDIRECT_URI,
                                mainWindowRedirectUri: process.env.REACT_APP_AD_REDIRECT_URI
                            });
                        } else {
                            navigate('/', { replace: true });
                        }
                    }}
                    onClose={() => {
                        setShowMenu('');
                    }}
                />
            }
        </div>
    );
};

export default Header;

