import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Toggle,
    // TextField,
    CustomOTPInput
} from '../../components';
import {
    getUserById, manageTwoFactorAuthentication,
    // resendOTP,
} from '../../services';
import '../../style/components/inviteOrganisation.css';
import { LocalStorageUserDetails } from '../../types';
import { getLocalStorage } from '../../utils';
import '../../style/pages/signup.css';
import {
    usertypes
} from '../../constants';

const AccountDetails = () => {
    const [state, setState] = useState({
        email: '',
        mobileNo: '',
        authEmail: false,
        authSMS: false,
        loading: true,
        errType: 'Error',
        errMessage: '',
        otpValue: '',
        otpValid: false,
        verifyOTP: false,
        otpLoading: false,
        otpErrType: 'Error',
        otpErrMessage: ''
    });

    const navigate = useNavigate();

    const setFormData = (values: any) => {
        setState((prevState: any) => ({
            ...prevState,
            ...values
        }));
    };

    const ref: any = useRef({
        email: '',
        mobileNo: '',
        authEmail: '',
        authSMS: ''
    });

    const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');

    const getUsers = async () => {
        const data: any = await getUserById(userDetails.id);
        if (data) {
            ref.current = {
                email: data.email,
                mobileNo: data.mobileNo,
                authEmail: data.authEmail,
                authSMS: data.authSMS
            };
            setFormData({
                email: data.email,
                mobileNo: data.mobileNo,
                authEmail: data.authEmail,
                authSMS: data.authSMS
            });
        }
    };

    const sendOTP = async (values: any) => {
        try {
            setFormData({
                loading: true
            });
            await manageTwoFactorAuthentication({
                email: values.email.toLowerCase(),
                mobileNo: values.mobileNo,
                authEmail: state.authEmail,
                authSMS: state.authSMS,
                otp: '',
            });
            const { authEmail, authSMS } = ref.current;
            if (authEmail !== state.authEmail || authSMS !== state.authSMS) {
                setFormData({
                    verifyOTP: true
                });
            } else {
                await getUsers();
                setFormData({
                    errType: 'Success',
                    errMessage: 'Mobile number updated successfully'
                });
            }
        } catch (err: any) {
            setFormData({
                errType: 'Error',
                errMessage: err.message
            });
        } finally {
            setFormData({
                loading: true
            });
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setFormData({
                otpLoading: true
            });
            const data: any = await manageTwoFactorAuthentication({
                email: state.email.toLowerCase(),
                mobileNo: state.mobileNo,
                authEmail: state.authEmail,
                authSMS: state.authSMS,
                otp: state.otpValue
            });
            await getUsers();
            setFormData({
                verifyOTP: false,
                errType: 'Success',
                errMessage: data.message
            });
        } catch (err: any) {
            setFormData({
                otpErrType: 'Error',
                otpErrMessage: err.message
            });
        } finally {
            setFormData({
                otpLoading: false,
                otpValue: '',
                otpValid: false
            });
        }
    };

    const handleResendOTP = async () => {
        try {
            const data: any = await manageTwoFactorAuthentication({
                email: state.email.toLowerCase(),
                mobileNo: state.mobileNo,
                authEmail: state.authEmail,
                authSMS: state.authSMS,
                otp: ''
            });
            setFormData({
                otpErrType: 'Success',
                otpErrMessage: data.message
            });
        } catch (err: any) {
            setFormData({
                otpErrType: 'Error',
                otpErrMessage: err.message
            });
        } finally {
            setFormData({
                otpValue: '',
                otpValid: false
            });
        }
    };

    const handleOTPChange = (otp: string) => {
        setFormData({
            otpValue: otp
        });
        if (otp.length === 6) {
            setFormData({
                otpValid: true
            });
        } else {
            setFormData({
                otpValid: false
            });
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        const { email, mobileNo, authEmail, authSMS } = ref.current;
        if (email !== state.email || mobileNo !== state.mobileNo || authEmail !== state.authEmail || authSMS !== state.authSMS) {
            setFormData({
                loading: false
            });
        } else {
            setFormData({
                loading: true
            });
        }
    }, [state.email, state.mobileNo, state.authEmail, state.authSMS]);

    return <div className='invite-blk-main'>
        <div className='invite-blk'>
            {!state.verifyOTP ? <section >
                <>
                    <h1 className='h1-text'>Two Factor Authentication</h1>
                    <p className='sub-text'>You can enable / disable your authentication method</p>
                    {state.errMessage && <div className={state.errType === 'Error' ? 'error-message' : 'success-message'}>
                        <p>{state.errMessage}</p>
                    </div>}
                    <Formik
                        enableReinitialize
                        initialValues={ref.current}
                        validationSchema={
                            Yup.object().shape({
                                email: Yup.string().email('Enter valid email').required('Email is required').trim(),
                                mobileNo: Yup.string().optional().matches(/^07[0-9]{9}$/, 'Enter a valid phone number'), // .matches(/^07[0-9]{9}$/, 'Enter a valid phone number')
                            })
                        }
                        onSubmit={sendOTP}
                    >
                        {() => <Form onFocus={() => {
                            setFormData({
                                errMessage: ''
                            });
                        }}>
                            <div className='verification-blk'>
                                <p>How would you like to receive a verification code?</p>
                                <div className='relative'>
                                    <div className="input-group pb-5">
                                        <label>Email address</label>
                                        <p className={` disabled-field ${!state.email ? 'disabled-placeholder' : ''}`}>{state.email ? state.email : 'Enter your email address'}</p>
                                    </div>
                                    {/* <div className="input-group pb-5">
                                        <div className='flex'>
                                            <label>Email address</label>
                                        </div>
                                        <div className='relative'>
                                            <TextField
                                                type="text"
                                                id="email"
                                                name="email"
                                                disabled
                                                placeholder="Enter your email address"
                                                onChange={(event: any) => {
                                                    const { value } = event.target;
                                                    setFormData({
                                                        email: value
                                                    });
                                                    setFieldValue('email', value);
                                                }}
                                            />
                                        </div>
                                    </div> */}
                                    <Toggle name='authEmail' checked={state.authEmail} onChange={(event: any) => {
                                        const { checked } = event.target;
                                        setFormData({
                                            authEmail: checked
                                        });
                                    }} />
                                </div>
                                <div className='relative'>
                                    <div className="input-group">
                                        <label>Mobile number</label>
                                        <p className={` disabled-field ${!state.mobileNo ? 'disabled-placeholder' : ''}`}>{state.mobileNo ? state.mobileNo : 'Enter your mobile number'}</p>
                                    </div>
                                    {/* <div className="input-group">
                                        <div className='flex'>
                                            <label>Mobile number</label>
                                        </div>
                                        <div className='relative'>
                                            <TextField
                                                type="text"
                                                id="mobileNo"
                                                name="mobileNo"
                                                disabled
                                                placeholder="Enter your mobile number"
                                                onChange={(event: any) => {
                                                    const { value } = event.target;
                                                    if (value) {
                                                        setFormData({
                                                            mobileNo: value
                                                        });
                                                    } else {
                                                        setFormData({
                                                            mobileNo: value,
                                                            authSMS: false
                                                        });
                                                    }
                                                    setFieldValue('mobileNo', value);
                                                }}
                                            />
                                        </div>
                                    </div> */}
                                    <Toggle name="authSMS" checked={state.authSMS} disabled={!state.mobileNo} onChange={(event: any) => {
                                        const { checked } = event.target;
                                        setFormData({
                                            authSMS: checked
                                        });
                                    }} />
                                </div>
                                <div className='footer-btn'>
                                    <Button type='submit' text='Verify' addClass='primary-btn' disabled={state.loading} />
                                </div>
                            </div>
                        </Form>}
                    </Formik>
                    {userDetails.usertype !== usertypes.superAdmin && <p className="sub-text note">Email address and mobile number can be changed on the <span onClick={() => navigate('/profile')}>account settings</span> page.</p>}
                </>
            </section> :
                <section>
                    <h1 className='h1-text'>Verify OTP</h1>
                    <p className='sub-text'>Verify OTP that has been sent to your email or mobile</p>
                    <div className='otp-content'>
                        <p>Please enter your 6-digit verification code below</p>
                        {state.otpErrType === 'Success' && <div className='pt-5'>
                            <div className='success-message'>
                                <p>{state.otpErrMessage}</p>
                            </div>
                        </div>}
                        <CustomOTPInput
                            inputCount={6}
                            handleChange={handleOTPChange}
                            otpValue={state.otpValue}
                            otpError={state.otpErrType === 'Error' ? state.otpErrMessage : ''}
                            resentOTP={handleResendOTP}
                        />
                    </div>
                    <div className='footer-btn'>
                        <Button text='Verify' addClass='primary-btn' disabled={state.otpLoading || !state.otpValid} onClick={async () => {
                            if (state.otpValue && state.otpValue.length === 6) {
                                handleVerifyOTP();
                            } else {
                                setFormData({
                                    otpErrMessage: 'Enter valid OTP',
                                    otpErrType: 'Error'
                                });
                            }
                        }}></Button>
                    </div>
                </section>}
        </div>
    </div>;
};

export default AccountDetails;
