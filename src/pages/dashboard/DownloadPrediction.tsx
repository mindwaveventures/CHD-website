import React, { useEffect, useState } from 'react';
import fileDownload from 'js-file-download';
import '../../style/components/historyData.css';
import FutureData from '../../assets/images/futureData.svg';
import GreenTickIcon from '../../assets/images/GreenTickIcon.svg';
import '../../style/components/button.css';
import { Button, Popup } from '../../components';
import { useNavigate } from 'react-router-dom';
import { checkPredictionStatus, downloadPrediction } from '../../services';

const DownloadPrediction: React.FC = () => {
    const navigate = useNavigate();
    const [predictionId, setPredictionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onDownload = async () => {
        try {
            setShowModal(true);
            setErrorMessage('');
            if (predictionId) {
                const { data, headers } = await downloadPrediction(predictionId);
                fileDownload(data, headers['file-name']);
            }
        } catch (err) {
            setErrorMessage('Something went wrong on download');
        } finally {
            setShowModal(false);
        }
    };

    const getPredictionStatus = async () => {
        try {
            setLoading(true);
            const { data }: any = await checkPredictionStatus();
            setPredictionId(data.id);
            if (!((data.future && !data.progress) || data.expired)) {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPredictionStatus();
    }, []);

    return (
        <>
            <div className="upload-history-blk">
                <div>
                    <h1 className='h1-text'>Upload and run future data <span><img src={FutureData} /></span></h1>
                </div>
                {errorMessage && <div className='error-message'>
                    <p>{errorMessage}</p>
                </div>}
                {/* model trained successfully*/}
                <div className='waiting-time-blk'>
                    <div className='waiting-time-content'>
                        <div className='flex items-center justify-center pb-5'><img src={GreenTickIcon} /></div>
                        <h3>The model has successfully generated predictions data.</h3>
                        <p>You can now download and view prediction data. The download function will be available for the next 24 hours.</p>
                        <div className='footer-btn'>
                            <Button text='View predictions' onClick={() => navigate('/predictions')} addClass='success-btn w-3/5 sm:w-full'></Button>
                        </div> <div className='success-model-btn '>
                            <Button text='Download predictions' disabled={loading} onClick={onDownload} addClass='success-btn w-3/5 sm:w-full'></Button>
                        </div>
                    </div>
                </div>
                {/* end */}
                {showModal &&
                    <Popup
                        headerText='Prediction Data' primaryContent='Your prediction data is downloading. Please wait...' btnText='Ok'
                        onBtnClick={() => setShowModal(false)} loading={true} closeIcon={true} showPopup={true} onClose={() => setShowModal(false)}
                    />}
            </div>
        </>
    );
};

export default DownloadPrediction;