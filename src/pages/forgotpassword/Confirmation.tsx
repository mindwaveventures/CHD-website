import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import '../../style/pages/signup.css';

function PasswordResetConfirmation() {
    const navigate = useNavigate();

    return (
        <div>
            <div className='main_card'>
                <div className='fm-block signup-blk'>
                    <section>
                        <section>
                            <h1 className='h1-text'>Password Reset Successful</h1>
                            <p className='sub-text'>Your Password reseted successfully you can login to continue</p>
                            <div className='footer-btn'>
                                <Button text='Back to home' addClass='primary-btn' onClick={() => {
                                    navigate('/login', { replace: true });
                                }}></Button>
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetConfirmation;