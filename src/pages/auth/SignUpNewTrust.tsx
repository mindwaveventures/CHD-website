import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import {
    useNavigate,
    useParams
} from 'react-router-dom';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import {
    verifyTrustTwoStepAuthentication,
    signUpWithNewTrust,
    resendOTP
} from '../../services';
import '../../style/pages/signup.css';
import arrowIcon from '../../assets/images/Arrowblue.svg';
import { CustomOTPInput } from '../../components/Customotp';
import Toggle from '../../components/Toggle';


function Signup() {
    const navigate = useNavigate();
    const [showRegisterForm, setShowRegisterForm] = useState(true);
    const [showAccessForm, setShowAccess] = useState(false);
    const [showRequestSentForm, setShowRequestSentForm] = useState(false);
    const [showAccessSent, setShowAccessSent] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [isOtpError, setOtpError] = useState('');

    const [changeType, setChangeType] = useState({
        password: 'password',
        confirmPassword: 'password'
    });

    const [otpSuccessMessage, setOTPSuccessMessage] = useState('');
    const [otpErrorMessage, setOTPErrorMessage] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [otpLoading, setOTPLoading] = useState<boolean>(false);
    const [otpValid, setOTPValid] = useState(true);

    const params = useParams();

    const [formData, setFormData] = useState<any>({
        trustName: params?.name || '',
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmPassword: '',
        email: '',
        mobileNo: '',
        authEmail: false,
        authSMS: false
    });

    const requestHeader = 'Request access to the WNB tool';
    const requestContent = 'Send a request to the Alder Hey team to create an account.';
    const organisationHeader = 'Join my organisation';
    const organisationContent = 'You can add yourself to your organisation’s account';

    const handleOTPChange = (otpData: any) => {
        setOtpValue(otpData);
        setOTPErrorMessage('');
        setOTPSuccessMessage('');
        if (otpData.length === 6) {
            setOTPValid(false);
        } else {
            setOTPValid(true);
        }
        if (isOtpError) {
            setOtpError('');
        }
    };

    const sendOTP = async () => {
        try {
            setLoading(true);
            await verifyTrustTwoStepAuthentication({
                authEmail: formData.authEmail,
                authSMS: formData.authSMS,
                email: formData.email.toLowerCase(),
                phone: formData.mobileNo,
                name: formData.trustName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            setOTPErrorMessage('');
            setShowOtp(true);
            setShowRequestSentForm(false);
        } catch (err: any) {
            setOTPErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const onRequestSignUp = async () => {
        try {
            setOTPLoading(true);
            await signUpWithNewTrust({
                otp: otpValue,
                email: formData.email.toLowerCase(),
                name: formData.trustName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            setShowAccessSent(true);
            setShowRequestSentForm(false);
            return true;
        } catch (err: any) {
            setOTPSuccessMessage('');
            setOTPErrorMessage(err.message);
            return false;
        } finally {
            setOTPValid(true);
            setOtpValue('');
            setOTPLoading(false);
        }
    };

    const resentOTP = async () => {
        try {
            const data: any = await resendOTP({
                email: formData.email.toLowerCase(),
                authEmail: formData.authEmail,
                authSMS: formData.authSMS
            });
            setOTPSuccessMessage(data.message || '');
            setOTPErrorMessage('');
        } catch (err: any) {
            setOTPErrorMessage(err.message);
            setOTPSuccessMessage('');
        } finally {
            setOTPValid(true);
            setOtpValue('');
        }
    };

    return (
        <div className='my-8'>
            <div className='main_card'>
                {showRegisterForm && <Formik
                    initialValues={{
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        trustName: formData.trustName
                    }}
                    validationSchema={
                        Yup.object().shape({
                            firstName: Yup.string().required('First name is required'),
                            lastName: Yup.string().required('Last name is required'),
                            email: Yup.string().email('Enter valid email').required('Email is required'),
                            trustName: Yup.string().required('Trust name is required')
                        })
                    }
                    onSubmit={() => {
                        setShowRegisterForm(false);
                        setShowAccess(true);
                    }}
                >
                    {({ setFieldValue }) => <Form className='fm-block signup-blk'>
                        <section>
                            <h1 className='h1-text'>{requestHeader}</h1>
                            <p className='sub-text'>{requestContent}</p>
                            <TextField
                                type="text"
                                label="Organisation Name*"
                                id="trustName"
                                name="trustName"
                                value={formData.trustName}
                                placeholder="Enter the organisation name"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('trustName', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        trustName: value
                                    }));
                                }}
                            />
                            <TextField
                                type="text"
                                label="Admin’s first name*"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                placeholder="Enter the admin’s first name"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('firstName', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        firstName: value
                                    }));
                                }}
                            />
                            <TextField type="text" label="Admin’s surname*"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                placeholder="Enter the admin’s last name"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('lastName', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        lastName: value
                                    }));
                                }}
                            />
                            <TextField type="text" label="Admin’s email address*"
                                id="email"
                                name="email"
                                value={formData.email}
                                placeholder="Enter the admin’s email address"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('email', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        email: value
                                    }));
                                }}
                            />
                            <div className='footer-btn'>
                                <Button type='submit' text='Next' addClass='primary-btn'></Button>
                            </div>
                        </section>
                    </Form>}
                </Formik>}
                {showAccessForm && <Formik
                    initialValues={{
                        confirmPassword: formData.confirmPassword,
                        password: formData.newPassword
                    }}
                    validationSchema={
                        Yup.object().shape({
                            // eslint-disable-next-line no-useless-escape
                            password: Yup.string().matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character').required('Password is required'),
                            confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required')
                        })
                    }
                    onSubmit={(values: any) => {
                        setFormData((prevState: any) => ({
                            ...prevState,
                            newPassword: values.password,
                            confirmPassword: values.confirmPassword
                        }));
                        setShowAccess(false);
                        setShowRequestSentForm(true);
                    }}
                >
                    {({ setFieldValue }) => <Form className='fm-block signup-blk'>
                        <section>
                            <img src={arrowIcon} className='arrow' onClick={() => {
                                setShowRegisterForm(true);
                                setShowAccess(false);
                            }}></img>
                            <h1 className='h1-text'>{requestHeader}</h1>
                            <p className='sub-text'>{requestContent}</p>
                            
                            <TextField
                                label="Set password *"
                                id="password"
                                name="password"
                                placeholder="Enter your Password"
                                type={changeType.password}
                                icon="password"
                                value={formData.newPassword}
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('password', event.target.value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        newPassword: value
                                    }));
                                }}
                                onIconClick={() => {
                                    if (changeType.password === 'password') {
                                        setChangeType((prevState: any) => ({
                                            ...prevState,
                                            password: 'text'
                                        }));
                                    } else {
                                        setChangeType((prevState: any) => ({
                                            ...prevState,
                                            password: 'password'
                                        }));
                                    }
                                }}
                            />
                            <p className='info-text'>Must contain 8 characters, one uppercase letter, one number and one special character</p>
                            <TextField
                                label="Confirm password *"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Re-enter your Password"
                                type={changeType.confirmPassword}
                                value={formData.confirmPassword}
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('confirmPassword', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        confirmPassword: value
                                    }));
                                }}
                                icon="password"
                                onIconClick={() => {
                                    if (changeType.confirmPassword === 'password') {
                                        setChangeType((prevState: any) => ({
                                            ...prevState,
                                            confirmPassword: 'text'
                                        }));
                                    } else {
                                        setChangeType((prevState: any) => ({
                                            ...prevState,
                                            confirmPassword: 'password'
                                        }));
                                    }
                                }}
                            />
                            <div className='footer-btn'>
                                <Button type='submit' text='Continue' addClass='primary-btn'></Button>
                            </div>
                        </section>
                    </Form>}
                </Formik>}
                {showRequestSentForm &&
                    <div className='fm-block signup-blk'>
                        <section >
                            <img src={arrowIcon} className='arrow' onClick={() => {
                                setShowAccess(true);
                                setShowRequestSentForm(false);
                            }}></img>
                            <h1 className='h1-text'>{organisationHeader}</h1>
                            <p className='sub-text'>{organisationContent}</p>
                            <div className='verification-blk'>
                                <p>Set up two-factor authentication to create your account.</p>
                                <p>How would you like to receive a verification code?</p>
                                {otpErrorMessage && <div className='error-message'>
                                    <p>{otpErrorMessage}</p>
                                </div>}
                                <div className='relative'>
                                    <div className="input-group pb-5">
                                        <div className='flex'>
                                            <label>Email address</label>
                                        </div>
                                        <div className='relative disable-transparent'>
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email address"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <Toggle name='mailAuth' checked={formData.authEmail} onChange={(event: any) => {
                                        const { checked } = event.target;
                                        setFormData((prevState: any) => ({
                                            ...prevState,
                                            authEmail: checked
                                        }));
                                    }} />
                                </div>
                                <div className='relative'>
                                    <div className="input-group">
                                        <div className='flex'>
                                            <label>Mobile number</label>
                                        </div>
                                        <div className='relative'>
                                            <input
                                                className='text-field'
                                                type="number"
                                                id="mobileNo"
                                                name="mobileNo"
                                                placeholder="Enter your mobile number"
                                                value={formData.mobileNo}
                                                onChange={(event) => {
                                                    setFormData((prevState: any) => ({
                                                        ...prevState,
                                                        mobileNo: event.target.value
                                                    }));
                                                }}
                                                disabled={!formData.authSMS}
                                            />
                                        </div>
                                    </div>
                                    <Toggle name="mobileAuth" checked={formData.authSMS} onChange={(event: any) => {
                                        const { checked } = event.target;
                                        setFormData((prevState: any) => ({
                                            ...prevState,
                                            authSMS: checked
                                        }));
                                    }} />
                                </div>
                            </div>
                            <div className='footer-btn'>
                                <Button text={(formData.authEmail || formData.authSMS) ? 'Send verification code' : 'Continue'} addClass='primary-btn' disabled={loading || otpLoading} onClick={async () => {
                                    if (formData.authEmail || formData.authSMS) {
                                        await sendOTP();
                                    } else {
                                        await onRequestSignUp();
                                    }
                                }}></Button>
                            </div>
                        </section>
                    </div>
                }
                {showOtp && (
                    <div className='fm-block signup-blk'>
                        <section>
                            <h1 className='h1-text'>{organisationHeader}</h1>
                            <p className='sub-text'>{organisationContent}</p>
                            <div className='otp-content'>
                                <p>Please enter your 6-digit verification code below</p>
                                {otpSuccessMessage && <div className='success-message'>
                                    <p>{otpSuccessMessage}</p>
                                </div>}
                                <CustomOTPInput
                                    inputCount={6}
                                    handleChange={handleOTPChange}
                                    otpValue={otpValue}
                                    otpError={otpErrorMessage}
                                    resentOTP={resentOTP}
                                />
                            </div>
                            <div className='footer-btn'>
                                <Button text='Verify' addClass='primary-btn' disabled={loading || otpValid} onClick={async () => {
                                    if (otpValue && otpValue.length === 6) {
                                        const data = await onRequestSignUp();
                                        if (data) {
                                            setShowOtp(false);
                                            setShowAccessSent(true);
                                            setOtpValue('');
                                        }
                                    } else {
                                        setOTPErrorMessage('Enter valid OTP');
                                    }
                                }}></Button>
                            </div>
                        </section>
                    </div>)}
                {showAccessSent && (
                    <div className='fm-block signup-blk'>
                        <section>
                            <h1 className='h1-text'>{requestHeader}</h1>
                            <p className='sub-text'>{requestContent}</p>
                            <div className='footer-btn'>
                                <Button text='Back to home' addClass='primary-btn' onClick={() => {
                                    navigate('/login', { replace: true });
                                }}></Button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Signup;