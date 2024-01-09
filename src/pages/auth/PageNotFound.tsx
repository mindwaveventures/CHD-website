import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/pages/pagenotfound.css';
import { Button } from '../../components';
import errorImage from '../../assets/images/errorImage.svg';

function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div className='pagenotfound'>
            <div className='pagerow'>
                <div className='textcol'>
                    <h1 className='h1-text'>Oops! Page not found</h1>
                    <p>We’re sorry, the page you requested could not be found. Please go back to the homepage</p>
                    <div className='home-btn'>
                        <Button type="submit" text='GO HOME' addClass='primary-btn' onClick={() => navigate('/')}></Button>
                    </div>
                </div>
                <div className='imagecol'>
                    <span><img src={errorImage} /></span>
                </div>
            </div>
        </div>
    );
}

export default PageNotFound;