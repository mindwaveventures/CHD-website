import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { setLocalStorage } from '../../utils/localstorage';
import { TextField, Button, Popup } from '../../components';
import { twoFactorAuthentication, adLogin } from '../../services';
import { loginRequest } from '../../middlewares/azure-interceptor';
import SessionExpiry from './Sessionexpired';

function LoginPage() {
    const navigate = useNavigate();
    const { instance } = useMsal();

    const [changeType, setChangeType] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [openSessionExpired, setOpenSessionExpired] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');

    const getStateValue = () => {
        const urlParams: any = /[?&]state=([^&#]*)/.exec(window.location.href) || [];
        return urlParams.length > 0 ? urlParams[1] : null;
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const data: any = await twoFactorAuthentication({
                email: values.username.toLowerCase().trim(),
                password: values.password
            });
            if (data.otp) {
                navigate(`/two-factor-authentication/${data.id}`);
            } else {
                setLocalStorage('userDetails', JSON.stringify(data));
                window.location.reload();
            }
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAzureLogin = async () => {
        try {
            setLoading(true);
            const data = await instance.loginPopup(loginRequest);
            const userData = await adLogin(data.accessToken);
            setLocalStorage('adlogin', 'true');
            setLocalStorage('userDetails', JSON.stringify(userData));
            window.location.reload();
        } catch (err: any) {
            if (err.message !== 'user_cancelled: User cancelled the flow.') {
                setErrorMessage(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSessionExpiry = () => {
        const queryParamState = getStateValue();
        if (queryParamState && queryParamState === 'session-expired') {
            setOpenSessionExpired(true);
        }
        if (queryParamState && queryParamState === 'role-changed') {
            // role changed model
            setModalText('Role ');
            setShowModal(true);
        }
        if (queryParamState && queryParamState === 'organisation-name-changed') {
            // Organisation name changed
            setModalText('Organisation name ');
            setShowModal(true);
        }
    };

    const onCloseSessionExpriy = () => {
        setOpenSessionExpired(false);
        navigate('/login');
    };

    useEffect(() => {
        handleSessionExpiry();
    }, []);

    return (
        <>
            <div className='my-8'>
                <div className='main_card sign-in'>
                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={
                            Yup.object().shape({
                                username: Yup.string().required('Email is required').trim(),
                                password: Yup.string().required('Password is required')
                            })
                        }
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form className='fm-block' onFocus={() => {
                                if (errorMessage) {
                                    setErrorMessage('');
                                }
                            }}>
                                <h1 className='h1-text'>Sign in</h1>
                                {errorMessage && <div className='error-message'>
                                    <p>{errorMessage}</p>
                                </div>}
                                <TextField
                                    type="text"
                                    label="Email*"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your email"
                                />
                                <TextField
                                    id="password"
                                    label="Password*"
                                    name="password"
                                    placeholder="Enter your password"
                                    type={changeType}
                                    icon="password"
                                    onIconClick={() =>
                                        changeType === 'password'
                                            ? setChangeType('text')
                                            : setChangeType('password')
                                    }
                                />
                                <div className='password-blk'>
                                    <p onClick={() => {
                                        navigate('/forgot-password/email');
                                    }}>Forgot password?</p>
                                </div>
                                <div className='footer-btn'>
                                    <Button disabled={loading} type="submit" text='Sign in' addClass='primary-btn'></Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className='footer-split-blk'>
                        <span></span>
                        Or
                        <span></span>
                    </div>
                    <div className='footer-btn'>
                        <Button onClick={handleAzureLogin} text='Sign in using my Alder Hey credentials' disabled={loading} addClass='secondary-btn'></Button>
                    </div>
                    <div className='signup-btn-blk'>
                        <p>Do not have an account? <span onClick={() => navigate('/sign-up')}>Sign up here</span></p>
                    </div>
                </div>
            </div>
            {openSessionExpired && <SessionExpiry onBtnClick={onCloseSessionExpriy} onClose={onCloseSessionExpriy} />}
            {showModal && <Popup
                loading={loading}
                addClass='h-250'
                onClose={() => {
                    setShowModal(false);
                }}
                onBtnClick={() => {
                    navigate('/login');
                    setShowModal(false);
                }}
                headerText={`${modalText}has been updated. Sign in again to continue`}
                btnText={'OK'}
            />
            }
        </>
    );
}

export default LoginPage;