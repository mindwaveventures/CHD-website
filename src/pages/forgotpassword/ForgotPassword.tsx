import React, { useState } from 'react';
import {
    useNavigate
} from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import { forgotPassword } from '../../services';
import arrowIcon from '../../assets/images/Arrowblue.svg';
import '../../style/pages/signup.css';

function ForgotPasswordPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(values: any) {
        try {
            const data: any = await forgotPassword(values.email.toLowerCase());
            navigate('/forgot-password/verify-otp', {
                replace: true,
                state: {
                    id: data.id
                }
            });
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    }

    return (
        <div className='my-8'>
            <div className='main_card forgot-password-blk'>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            email: Yup.string().email('Enter a valid email').required('Email is required'),
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
                            <img src={arrowIcon} className='arrow' onClick={() => {
                                navigate('/login');
                            }}></img>
                            <h1 className='h1-text'>Forgot password</h1>
                            {errorMessage && <div className='error-message'>
                                <p>{errorMessage}</p>
                            </div>}
                            <TextField
                                type="text"
                                label="Email *"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                            />
                            <div className='footer-btn'>
                                <Button type='submit' text='Submit' addClass='primary-btn' />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;