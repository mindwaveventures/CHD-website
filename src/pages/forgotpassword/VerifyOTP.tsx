import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, CustomOTPInput } from '../../components';
import { forgotPasswordResendOTP, verifyOTPById } from '../../services';
import '../../style/pages/signup.css';

function VerifyOTP() {
    const [message, setErrMessage] = useState({
        message: '',
        status: false,
        type: 'Error'
    });
    const [otpValue, setOTPValue] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { state }: any = useLocation();

    // useEffect(()=>{
    //     if (Object.keys(state).length > 0) {
    //         navigate('/forgot-password/email');
    //     }
    // },[]);

    const resentOTP = async () => {
        try {
            const data: any = await forgotPasswordResendOTP(state.id);
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
            const data: any = await verifyOTPById(state.id, otpValue);
            navigate('/forgot-password/set-password', {
                replace: true,
                state: {
                    id: data.id
                }
            });
            setLoading(false);
        } catch (err: any) {
            setErrMessage({
                message: err.message,
                status: true,
                type: 'Error'
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
                status: false,
                type: 'Error'
            });
        }
    };

    return (
        <div className='my-8'>
            <div className='main_card sign-up-otp'>
                <div className='fm-block signup-blk'>
                    <section>
                        <h1 className='h1-text'>OTP Verification</h1>
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

export default VerifyOTP;