import React, { useEffect, useState } from 'react';
import { Popup } from '../../components';
import '../../style/pages/dashboard.css';
import historicLogo from '../../assets/images/uploadHistory.svg';
import futureData from '../../assets/images/futureData.svg';
import DownloadData from '../../assets/images/downloadData.svg';
import InfoIcon from '../../assets/images/InfoIcon.svg';
import { useNavigate } from 'react-router-dom';
import { checkPredictionStatus } from '../../services';
import { fileUploadStatus } from '../../constants';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [showModal, setShowmodal] = useState('');
    const [predictionStatus, setPredictionStatus] = useState({
        future: false,
        download: false
    });

    const cardContent = [{
        id: 1,
        image: historicLogo,
        name: 'Upload historic data',
        description: 'Upload historic data to train the model.'

    }, {
        id: 2,
        image: futureData,
        name: 'Upload future data',
        description: 'Upload future data to generate predictions.'

    }, {
        id: 3,
        image: DownloadData,
        name: 'Download predictions',
        description: 'Download predictions as a CSV file and save them to your desktop.'

    }];
    function openPopup(id: any) {
        if (id === 1) {
            setShowmodal('historyData');
        } else if (id === 2) {
            setShowmodal('futureData');
        } else {
            setShowmodal('downloadData');
        }

    }

    const getPredictionStatus = async () => {
        try {
            const { data }: any = await checkPredictionStatus();
            setPredictionStatus({
                future: (data.historic && data.status === fileUploadStatus.completed) || data.future,
                download: data.future && data.status === fileUploadStatus.completed && !data.expired
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPredictionStatus();
    }, []);

    const onclickNavigate = (item: any) => {
        if (item.id === 1) {
            navigate('/upload-history-data');
        } else if (item.id === 2) {     //  && predictionStatus.future
            navigate('/upload-future-data');
        } else if (item.id === 3 && predictionStatus.download) {
            navigate('/download-predictions');
        }
    };

    return (
        <>
            <div className='dashboard-blk'>
                <div className='dashboard-header-blk'>
                    <h1 className='h1-text'>Alder Hey WNB prediction tool</h1>
                </div>
                <div className='card-section'>
                    {cardContent.map((item: any, i: number) => (
                        <div className='dashboard-card' key={i} >
                            <div className={`card-blk ${((item.id === 3 && !predictionStatus.download)) ? 'disable-border' : ''}`}  // (item.id === 2 && !predictionStatus.future) || 
                                onClick={() => onclickNavigate(item)}>
                                {((item.id === 3 && !predictionStatus.download)) &&     // (item.id === 2 && !predictionStatus.future) || 
                                    <div className='overlay'></div>}
                                <div className='card-content'>
                                    <div>
                                        <img src={item.image}></img>
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                            </div>
                            <p className='card-des'>
                                {item.description}
                            </p>
                            <img src={InfoIcon} onClick={() => openPopup(item.id)} />
                        </div>
                    ))}
                </div>
            </div>
            {showModal === 'historyData' &&
                <Popup primaryContent={'Please upload historic data files to train this model.'}
                    secondaryContent={'Once the model is fully trained, you can upload future data files and download predictions based on this trained model.'}
                    headerText={'Upload historic data'}
                    onBtnClick={() => {
                        navigate('/upload-history-data');
                    }}
                    btnText={'Go to upload historic data'} infoIcon={true} onClose={() => {
                        setShowmodal('');
                    }} />}
            {showModal === 'futureData' &&
                <Popup primaryContent={'Since your model has been trained before, you can perform the following functions. '}
                    secondaryContent={'1. Re-train the model using historic data files  2. Upload future data files to obtain predictions'}
                    headerText={'Upload future data'}
                    // loading={!predictionStatus.future}
                    onBtnClick={() => {
                        navigate('/upload-future-data');
                    }}
                    btnText={'Go to upload future data'} infoIcon={true} onClose={() => {
                        setShowmodal('');
                    }} />}
            {showModal === 'downloadData' &&
                <Popup primaryContent={'You can download the prediction here'}
                    secondaryContent={'Once both historic data and future data is processed by AI you can download it in here.'}
                    headerText={'Download prediction data'}
                    loading={!predictionStatus.download}
                    onBtnClick={() => {
                        navigate('/download-predictions');
                    }}
                    btnText={'Go to download prediction data'} infoIcon={true} onClose={() => {
                        setShowmodal('');
                    }} />}
        </>
    );
};

export default Dashboard;

