import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import '../../style/pages/signup.css';
import { organisationCreationRequest } from '../../services';
import arrowIcon from '../../assets/images/Arrowblue.svg';
import { useNavigate } from 'react-router';

const Support = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        status: false,
        type: '',
        message: ''
    });

    const onSubmit = async (values: any, { resetForm }: any) => {
        try {
            setLoading(true);
            await organisationCreationRequest(values);
            resetForm();
            setMessage({
                status: true,
                type: 'Success',
                message: 'Request has been sent successfully and you will be contact shortly via email address that you provided'
            });
        } catch (err: any) {
            setMessage({
                status: true,
                type: 'Error',
                message: err.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='my-8'>
            <div className='main_card support-blk'>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        comments: '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            name: Yup.string().required('Name is required'),
                            email: Yup.string().email('Enter a valid email').required('Email is required'),
                            comments: Yup.string().required('Comments is required'),
                        })
                    }
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue, errors, touched, values, setFieldTouched  }) => <Form
                        className='fm-block signup-blk'
                        onChange={() => setMessage({
                            status: false,
                            type: '',
                            message: ''
                        })}
                    >
                        <section>
                        <img src={arrowIcon} className='arrow' onClick={() => {
                                navigate('/sign-up');
                            }}></img>
                            <h1 className='h1-text'>Contact support</h1>
                            {message.status && <div className={message.type === 'Error' ? 'error-message' : 'success-message'}>
                                <p>{message.message}</p>
                            </div>}
                            <TextField
                                type="text"
                                label="Name*"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                            />
                            <TextField
                                type="text"
                                label="Email*"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                            />
                            <div className='support-comment'>
                                <label htmlFor='comments'>Comments*</label>
                                <textarea
                                    className='support-textarea'
                                    name="comments"
                                    id="comments"
                                    maxLength={500}
                                    value={values.comments}
                                    placeholder='Enter your coments here'
                                    onChange={(e: any) => {
                                        const { value } = e.target;
                                        setFieldValue('comments', value);
                                    }}
                                    onBlur={() => setFieldTouched('comments', true)}
                                />
                                {errors.comments && touched.comments && <div className='aw-error'>{errors.comments}</div>}
                                <p className='comment-note'>Maximum 500 characters</p>

                            </div>

                            <div className='footer-btn'>
                                <Button type='submit' disabled={loading} text='Submit' addClass='primary-btn' />
                            </div>
                        </section>
                    </Form>}
                </Formik>
            </div>
        </div>
    );
};

export default Support;
