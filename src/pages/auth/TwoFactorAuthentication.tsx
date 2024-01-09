import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { setLocalStorage } from '../../utils/localstorage';
import { Button, CustomOTPInput } from '../../components';
import { signin, resendOTPById } from '../../services';
import { otpVerificationType } from '../../constants';

function TwoFactorAuthentication() {
    const [message, setErrMessage] = useState({
        message: '',
        status: false,
        type: 'Error'
    });
    const [otpValue, setOTPValue] = useState('');
    const [loading, setLoading] = useState(true);

    const params = useParams();

    const resentOTP = async () => {
        try {
            const data: any = await resendOTPById(params.id || '', otpVerificationType.loginVerification);
            setErrMessage({
                message: data.message,
                type: 'Success',
                status: true
            });
        } catch (err: any) {
            setErrMessage({
                message: err.message,
                type: 'Error',
                status: true
            });
        } finally {
            setOTPValue('');
        }
    };

    const verifyOTP = async () => {
        try {
            setLoading(true);
            const { data } = await signin({
                id: params.id || '',
                otp: otpValue,
            });
            setLocalStorage('userDetails', JSON.stringify(data));
            window.location.reload();
        } catch (err: any) {
            setErrMessage({
                message: err.message,
                type: 'Error',
                status: true
            });
            setLoading(true);
        } finally {
            setOTPValue('');
        }
    };

    const handleOTPChange = (otp: string) => {
        setOTPValue(otp);
        if (otp.length === 6) {
            setLoading(false);
        } else {
            setLoading(true);
        }
        if (message.status) {
            setErrMessage({
                message: '',
                type: 'Error',
                status: false
            });
        }
    };

    return (
        <div className='my-8'>
            <div className='main_card'>
                <div className='fm-block signup-blk'>
                    <section>
                        <h1 className='h1-text'>Two Factor Authentication</h1>
                        <p className='sub-text'>Verify your account by the OTP that has been sent to you</p>
                        <div className='otp-content'>
                            <p>Please enter your 6-digit verification code below</p>
                            {message.status && <div className={message.type === 'Error' ? 'error-message' : 'success-message'}>
                                <p>{message.message}</p>
                            </div>}
                            <CustomOTPInput
                                inputCount={6}
                                handleChange={handleOTPChange}
                                otpValue={otpValue}
                                otpError=''
                                resentOTP={resentOTP}
                            />
                        </div>
                        <div className='footer-btn'>
                            <Button text='Verify' addClass='primary-btn' disabled={loading} onClick={verifyOTP}></Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default TwoFactorAuthentication;