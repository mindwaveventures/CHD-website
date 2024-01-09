import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import '../../style/components/inviteOrganisation.css';
import { getUserById, updateProfile } from '../../services';
import { getLocalStorage } from '../../utils';
import { LocalStorageUserDetails } from '../../types';
function ProfileDetail() {
    const [message, setMessage] = useState({
        status: false,
        message: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mobileNo: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');

    const getUser = async () => {
        const data: any = await getUserById(userDetails.id);
        setFormData({
            mobileNo: data.mobileNo,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
        });
    };

    const refreshProfile = (data: any) => {
        const x = window.open('', 'myWindow', 'width=1,height=1');
        x?.localStorage.setItem('userDetails', JSON.stringify({
            ...userDetails,
            name: data.name,
            email: data.email
        }));
        localStorage.setItem('token', data.token);
        x?.close();
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            const data: any = await updateProfile({
                // email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                mobileNo: values.mobileNo
            });
            refreshProfile(data);
            setMessage({
                status: true,
                message: data.message,
                type: 'Success'
            });
        } catch (err: any) {
            setMessage({
                status: true,
                message: err.message,
                type: 'Error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className='invite-blk-main'>
            {message.status && <div className={message.type === 'Error' ? 'error-message' : 'success-message'}>
                <p>{message.message}</p>
            </div>}
            <div className='invite-blk'>
                <Formik
                    enableReinitialize
                    initialValues={formData}
                    validationSchema={
                        Yup.object().shape({
                            firstName: Yup.string()
                                .required('First name is required')
                                .trim(),
                            lastName: Yup.string()
                                .required('Sur name is required')
                                .trim(),
                            email: Yup.string().email('Enter valid email').required('Email is required'),
                            mobileNo: Yup.string().optional().matches(/^07[0-9]{9}$/, 'Enter a valid phone number'),
                        })
                    }
                    onSubmit={onSubmit}
                >
                    <Form onFocus={() => {
                        setMessage({
                            status: false,
                            message: '',
                            type: ''
                        });
                    }}>
                        <section className='invite-content'>
                            <h1 className='h1-text'>Profile details</h1>
                            <TextField
                                type="text"
                                label="First name"
                                id="firstname"
                                name="firstName"
                                placeholder="Enter the First name"
                            />
                            <TextField
                                type="text"
                                label="Surname"
                                id="surName"
                                name="lastName"
                                placeholder="Enter the surname"
                            />
                            {formData.email ? <div className="input-group">
                                <label>Email</label>
                                <p className={` disabled-field ${!formData.email ? 'disabled-placeholder' : ''}`}>{formData.email ? formData.email : 'Enter your email'}</p>
                            </div> : <TextField
                                type="text"
                                label="Email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                disabled={formData.email ? true : false}
                            />}
                            <TextField
                                type="text"
                                label="Mobile number"
                                id="mobileNo"
                                name="mobileNo"
                                placeholder="Enter your mobile number"
                            />
                            <div className='invite_footer_btn'>
                                <Button disabled={loading} text='Update' addClass='success-btn'></Button>
                            </div>
                        </section>
                    </Form>
                </Formik>
            </div>

        </div>
    );
}

export default ProfileDetail;