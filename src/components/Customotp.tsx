import React from 'react';
import OtpInput from 'react-otp-input';
import '../style/components/customOtp.css';
interface CustomOTPInputProps {
    inputCount: 6;
    handleChange: any;
    otpValue: any;
    otpError: string;
    resentOTP: any;
}
export const CustomOTPInput: React.FC<CustomOTPInputProps> = ({ inputCount, handleChange, otpValue, otpError, resentOTP }) => {
    return (
        <div className='otp-content'>
            <div className='otp-err'>
            {otpError && <p>{otpError}</p>}
            </div>
            <OtpInput
                value={otpValue}
                onChange={handleChange}
                numInputs={inputCount}
                inputStyle={`custom-otp-field ${otpError ? 'custom-otp-field-error' : ''}`}
                renderInput={(props) => <input {...props}/>}
                renderSeparator={<span>&nbsp;&nbsp;</span>}
                inputType="tel"
                shouldAutoFocus={true}
            />
            <p>It may take a minute to receive your code. Haven’t received it? <span className='sub-code' onClick={resentOTP}>Resend code</span></p>
        </div>
    );
};