import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import '../../style/components/inviteOrganisation.css';
import { createTrustOrAdmin } from '../../services';

function InviteOrganisation() {
    const [message, setMessage] = useState({
        status: false,
        message: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);

    const createTrust = async (values: any, { resetForm }: any) => {
        try {
            setLoading(true);
            const data: any = await createTrustOrAdmin({
                name: values.organisationName,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email.toLowerCase()
            });
            resetForm();
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

    return (
        <div className='invite-blk-main'>
            {message.status && <div className={message.type === 'Error' ? 'error-message' : 'success-message'}>
                <p>{message.message}</p>
            </div>}
            <div className='invite-blk'>
                <Formik
                    initialValues={{
                        organisationName: '',
                        firstName: '',
                        lastName: '',
                        email: ''
                    }}
                    validationSchema={
                        Yup.object().shape({
                            organisationName: Yup.string()
                            .required('Organisation name is required')
                            .matches(/^[A-Za-z0-9- ]+$/, 'Enter a valid organisation name')
                            .trim(),
                            email: Yup.string().email('Enter valid email').required('Email is required'),
                            firstName: Yup.string().required('First name is required').trim(),
                            lastName: Yup.string().required('Last name is required').trim(),
                        })
                    }
                    onSubmit={createTrust}
                >
                    {({errors, touched, setFieldTouched, setFieldValue}) => (
                        <Form onFocus={() => {
                            setMessage({
                                status: false,
                                message: '',
                                type: ''
                            });
                        }}>
                            <section className='invite-content'>
                                <h1 className='h1-text'>Invite an Organisation</h1>
                                <TextField
                                    type="text"
                                    label="Organisation name*"
                                    id="organisation name"
                                    name="organisationName"
                                    placeholder="Enter the Organisation's name"
                                    onBlur={()=>setFieldTouched('organisationName', true)}
                                    onChange={(event)=>{
                                        if(!touched.organisationName){
                                            setFieldTouched('organisationName', true);
                                        }
                                        setFieldValue('organisationName', event.target.value);
                                    }}
                                />
                                {!(errors.organisationName && touched.organisationName) && <p className='sub-text note'>Organisation name must be Alphabets or Numbers </p>}
                                <TextField
                                    type="text"
                                    label="Admin’s first name*"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter the admin’s first name"
                                />
                                <TextField
                                    type="text"
                                    label="Admin’s surname*"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter the admin’s last name"
                                />
                                <TextField
                                    type="text"
                                    label="Admin’s email address*"
                                    id="email"
                                    name="email"
                                    placeholder="Enter the admin’s email address"
                                />
                                <div className='invite_footer_btn'>
                                    <Button type='submit' disabled={loading} text='Send Invite' addClass='success-btn'></Button>
                                </div>
                            </section>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default InviteOrganisation;