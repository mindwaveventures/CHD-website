import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import {
    useNavigate
} from 'react-router-dom';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import {
    getTrustNameAndId,
    verifyTwoStepAuthentication,
    signUpWithExistingTrust,
    resendOTP
} from '../../services';
import '../../style/pages/signup.css';
import arrowIcon from '../../assets/images/Arrowblue.svg';
import { CustomOTPInput } from '../../components/Customotp';
import Toggle from '../../components/Toggle';
import Loader from '../../components/Loader';
import { capitalizeFirstLetter } from '../../utils';
import { otpVerificationType } from '../../constants';


function Signup() {
    const navigate = useNavigate();
    const [showOrganisation, setShowOrganisation] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
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
    const [newOrganisation, setNewOrganisation] = useState(true);
    const [organisationList, setOrganisationList] = useState<any>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [organisationNotExist, setOrganisationNotExist] = useState<boolean>(false);
    const [organisationLoading, setOrganisationLoading] = useState(false);

    const [otpErrorMessage, setOTPErrorMessage] = useState<string>('');
    const [otpSuccessMessage, setOTPSuccessMessage] = useState('');
    const [otpValid, setOTPValid] = useState(true);

    const [loading, setLoading] = useState<boolean>(false);
    const [otpLoading, setOTPLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<any>({
        trustName: '',
        trustId: '',
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
    const requestContent = 'Your request has been sent to your organisation’s admin';
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
            await verifyTwoStepAuthentication({
                emailAuth: formData.authEmail,
                smsAuth: formData.authSMS,
                email: formData.email.toLowerCase(),
                phone: formData.mobileNo,
                trustId: formData.trustId,
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
            await signUpWithExistingTrust({
                email: formData.email.toLowerCase(),
                otp: otpValue,
                trustId: formData.trustId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
                OTPType: otpVerificationType.setNewAccountPassword
            });
            setOTPErrorMessage('');
            setShowAccessSent(true);
            setShowRequestSentForm(false);
            return true;
        } catch (err: any) {
            setOTPSuccessMessage('');
            setOTPErrorMessage(err.message);
            return false;
        } finally {
            setOtpValue('');
            setOTPValid(true);
            setOTPLoading(false);
        }
    };

    const getAllOrganisation = async (searchText: string) => {
        try {
            setOrganisationLoading(true);
            const { rows }: any = await getTrustNameAndId(searchText);
            setSearchValue(searchText);
            setOrganisationList(rows || []);
            if (searchText && rows && rows.length <= 0) {
                setOrganisationNotExist(true);
            } else {
                setOrganisationNotExist(false);
            }
        } finally {
            setOrganisationLoading(false);
        }
    };

    const resentOTP = async () => {
        try {
            const data: any = await resendOTP({
                email: formData.email.toLowerCase(),
                authEmail: formData.authEmail,
                authSMS: formData.authSMS,
                OTPType: otpVerificationType.setNewAccountPassword
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
            <div className='main_card find-org'>
                {showOrganisation && <Formik
                    initialValues={{
                        organisationName: formData.trustName
                    }}
                    validationSchema={
                        Yup.object().shape({
                            organisationName: Yup.string().required('Organisation name is required')
                        })
                    }
                    onSubmit={(values: any) => {
                        const organisationExist = organisationList.find((item: any) => item.name === values.organisationName);
                        if (!organisationExist) {
                            setShowOrganisation(false);
                            setShowRegisterForm(true);
                        } else {
                            setNewOrganisation(true);
                        }
                    }}
                >
                    {({ setFieldValue }) => <Form className='fm-block signup-blk'>
                        <section>
                            <img src={arrowIcon} className='arrow' onClick={() => {
                                navigate('/login');
                            }}></img>
                            <h1 className='h1-text'>Find my organisation</h1>
                            <p className='sub-text'>You can join you organisation or send a request to join your organisation.</p>
                            <div className='relative'>
                                <div className='input-group'>
                                    <div className='flex'>
                                        <label htmlFor="organisationName">Look for your organisation here :</label>
                                    </div>
                                    <div className='relative'>
                                        <input
                                            autoComplete='off'
                                            type="text"
                                            className='text-field'
                                            name="organisationName"
                                            placeholder="Enter your organisation's email"
                                            value={capitalizeFirstLetter(formData.trustName)}
                                            onChange={(event: any) => {
                                                const { value } = event.target;
                                                getAllOrganisation(value);
                                                setNewOrganisation(true);
                                                setFieldValue('organisationName', value);
                                                setFormData((prevState: any) => ({
                                                    ...prevState,
                                                    trustId: '',
                                                    trustName: value
                                                }));
                                            }}
                                        />
                                        {searchValue && organisationList.length > 0 &&
                                            <div className={`organisation-list-blk list-space ${organisationList.length >= 4 ? 'blk-height' : ''}`}>
                                                {organisationList.map((item: any) => <div key={item.id} onClick={() => {
                                                    setFieldValue('organisationName', item.name);
                                                    setOrganisationList([]);
                                                    setNewOrganisation(false);
                                                    setFormData((prevState: any) => ({
                                                        ...prevState,
                                                        trustId: item.id,
                                                        trustName: item.name
                                                    }));
                                                }}>{capitalizeFirstLetter(item.name)}</div>)}
                                            </div>
                                        }
                                        {organisationLoading && organisationList.length == 0 &&
                                            <div className={'organisation-list-blk loader-height'}>
                                                <Loader status addclass="inner-loader sprinner-load-center" />
                                            </div>
                                        }
                                    </div>

                                </div>

                            </div>
                            {organisationNotExist && <div className='error-message'>
                                <p>Your organisation is not registered. Please contact support <span
                                    onClick={() => navigate('/support')}>click here</span></p>
                            </div>}
                            <div className='footer-btn'>
                                <Button disabled={newOrganisation} type='submit' text='Next' addClass='primary-btn'></Button>
                            </div>
                        </section>
                    </Form>}
                </Formik>}
                {showRegisterForm && <Formik
                    initialValues={{
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email
                    }}
                    validationSchema={
                        Yup.object().shape({
                            firstName: Yup.string().required('First name is required'),
                            lastName: Yup.string().required('Last name is required'),
                            email: Yup.string().email('Email must be valid').required('Email is required')
                        })
                    }
                    onSubmit={() => {
                        setShowRegisterForm(false);
                        setShowAccess(true);
                    }}
                >
                    {({ setFieldValue }) => <Form className='fm-block signup-blk'>
                        <section>
                            <img src={arrowIcon} className='arrow' onClick={() => {
                                setShowOrganisation(true);
                                setShowRegisterForm(false);
                            }}></img>
                            <h1 className='h1-text'>{requestHeader}</h1>
                            <p className='sub-text'>{requestContent}</p>
                            <TextField
                                type="text"
                                label="First name*"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                placeholder="Enter the first name"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('firstName', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        firstName: value
                                    }));
                                }}
                            />
                            <TextField
                                type="text"
                                label="Surname*"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                placeholder="Enter the last name"
                                onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue('lastName', value);
                                    setFormData((prevState: any) => ({
                                        ...prevState,
                                        lastName: value
                                    }));
                                }}
                            />
                            <TextField type="text" label="Email address*"
                                id="email"
                                name="email"
                                value={formData.email}
                                placeholder="Enter the email address"
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
                            password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/, 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character').required('Password is required'),
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
                    <Formik
                        initialValues={{
                            email: formData.email,
                            mobileNo: formData.mobileNo
                        }}
                        validationSchema={
                            Yup.object().shape({
                                // eslint-disable-next-line no-useless-escape
                                email: Yup.string().email('Enter valid email'),
                                mobileNo: Yup.string().matches(/^07[0-9]{9}$/, 'Enter a valid phone number'),
                            })
                        }
                        onSubmit={async () => {
                            if (formData.authEmail || formData.authSMS) {
                                await sendOTP();
                            } else {
                                await onRequestSignUp();
                            }
                        }}>
                        {({ setFieldValue }) => <Form>
                            <div className='fm-block signup-blk'>
                                <section >
                                    <img src={arrowIcon} className='arrow' onClick={() => {
                                        setShowAccess(true);
                                        setShowRequestSentForm(false);
                                        setOTPErrorMessage('');
                                    }}></img>
                                    <h1 className='h1-text'>{organisationHeader}</h1>
                                    <p className='sub-text'>{organisationContent}</p>

                                    <div className='verification-blk'>
                                        <p>It is advisable to enable 2-step verification for your account as an extra layer of security.</p>
                                        <p>How would you like to receive a verification code?</p>
                                        {otpErrorMessage && <div className='error-message'>
                                            <p>{otpErrorMessage}</p>
                                        </div>}
                                        <div className='relative'>
                                            <div className="input-group pb-5">
                                                <label>Email address</label>
                                                <p className={` disabled-field ${!formData.email ? 'disabled-placeholder' : ''}`}>{formData.email ? formData.email : 'Enter your email address'}</p>
                                            </div>
                                            {/* <div className="input-group pb-5">
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
                                            </div> */}
                                            <Toggle name='mailAuth' checked={formData.authEmail} onChange={(event: any) => {
                                                const { checked } = event.target;
                                                setFormData((prevState: any) => ({
                                                    ...prevState,
                                                    authEmail: checked
                                                }));
                                            }} />
                                        </div>
                                        <div className='relative'>
                                            {!formData.authSMS ? <div className="input-group">
                                                <label>Mobile number</label>
                                                <p className={` disabled-field ${!formData.mobileNo ? 'disabled-placeholder' : ''}`}>{formData.mobileNo ? formData.mobileNo : 'Enter your mobile number'}</p>
                                            </div> : <div className="input-group number-input">
                                                <div className='flex'>
                                                    <label>Mobile number</label>
                                                </div>
                                                <div className='relative'>
                                                    <TextField
                                                        type="text"
                                                        id="mobileNo"
                                                        name="mobileNo"
                                                        disabled={!formData.authSMS}
                                                        placeholder="Enter your mobile number"
                                                        onChange={(e: any) => {
                                                            setFieldValue('mobileNo', e.target.value);
                                                            setFormData((prevState: any) => ({
                                                                ...prevState,
                                                                mobileNo: e.target.value
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>}

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
                                        <Button text={(formData.authEmail || formData.authSMS) ? 'Send verification code' : 'Continue'} type='submit' addClass='primary-btn' disabled={loading || otpLoading} ></Button>
                                    </div>
                                </section>
                            </div>
                        </Form>}
                    </Formik>
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