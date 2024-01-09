import React, { useState } from 'react';
import {
    useParams
} from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '../../components';
import '../../style/components/inviteOrganisation.css';
import { editTrust } from '../../services';

function InviteOrganisation() {
    const [message, setMessage] = useState({
        status: false,
        message: '',
        type: ''
    });
    const [loading, setLoading] = useState(false);

    const params = useParams();

    const createTrust = async (values: any) => {
        try {
            setLoading(true);
            const data: any = await editTrust({
                id: params.id || '',
                name: values.organisationName
            });
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
                        organisationName: params.name,
                    }}
                    validationSchema={
                        Yup.object().shape({
                            organisationName: Yup.string().required('Organisation name is required')
                        })
                    }
                    onSubmit={createTrust}
                >
                    {() => (
                        <Form onFocus={() => {
                            setMessage({
                                status: false,
                                message: '',
                                type: ''
                            });
                        }}>
                            <section className='invite-content'>
                                <h1 className='h1-text'>Edit an Organisation</h1>
                                <TextField
                                    type="text"
                                    label="Organisation name*"
                                    id="organisation name"
                                    name="organisationName"
                                    placeholder="Enter the Organisation's name"
                                />
                                <div className='invite_footer_btn'>
                                    <Button type='submit' disabled={loading} text='Submit' addClass='success-btn'></Button>
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