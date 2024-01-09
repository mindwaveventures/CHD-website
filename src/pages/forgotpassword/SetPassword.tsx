import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import '../../style/pages/signup.css';
import { Button, TextField } from '../../components';
import { createOrChangePassword } from '../../services';

function SetPassword() {
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [changeType, setChangeType] = useState({
        password: 'password',
        confirmPassword: 'password'
    });

    const { state }: any = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!state || !state.id){
            navigate('/page-not-found', {
                replace: true
            });
        }
    }, []);

    // if (Object.keys(state).length > 0) {
    //     navigate('/forgot-password/email');
    // }

    const changePassword = async (values: any) => {
        try {
            setLoading(true);
            await createOrChangePassword({
                id: state.id,
                newPassword: values.password,
                confirmPassword: values.confirmPassword
            });
            navigate('/forgot-password/password-reset-successfully', { replace: true });
        } catch (err: any) {
            setErrMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='my-8'>
            <div className='main_card'>
                {state && <div className='fm-block signup-blk'>
                    <Formik
                        initialValues={{
                            confirmPassword: '',
                            password: ''
                        }}
                        validationSchema={
                            Yup.object().shape({
                                // eslint-disable-next-line no-useless-escape
                                password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/, 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character').required('Password is required'),
                                confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required')
                            })
                        }
                        onSubmit={changePassword}
                    >
                        <Form className='fm-block signup-blk' onFocus={() => {
                            setErrMessage('');
                        }}>
                            <section>
                                <h1 className='h1-text'>Set new password</h1>
                                <p className='sub-text'>You can set a new password</p>
                                {errMessage && <div className='error-message'>
                                    <p>{errMessage}</p>
                                </div>}
                                <TextField
                                    label="Set password *"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your Password"
                                    type={changeType.password}
                                    icon="password"
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
                                    }
                                    }
                                />
                                <p className='info-text'>Must contain 8 characters, one uppercase letter, one number and one special character</p>
                                <TextField
                                    label="Confirm password *"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter your Password"
                                    type={changeType.confirmPassword}
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
                                    }
                                    }
                                />
                                <div className='footer-btn'>
                                    <Button type='submit' text='Reset Password' disabled={loading} addClass='primary-btn'></Button>
                                </div>
                            </section>
                        </Form>
                    </Formik>
                </div>}
            </div>
        </div>
    );
}

export default SetPassword;