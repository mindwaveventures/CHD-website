import React, { useState, useEffect, useRef } from 'react';
import '../../style/components/historyData.css';
import '../../style/components/button.css';
import { FileUpload, Button, Loading } from '../../components';
import historicLogo from '../../assets/images/uploadHistory.svg';
import GreenTickIcon from '../../assets/images/GreenTickIcon.svg';
import ErrorIcon from '../../assets/images/ErrorIcon.svg';
import TimeIcon from '../../assets/images/TimeIcon.svg';
import { useNavigate } from 'react-router-dom';
import { uploadHistoricData, checkPredictionStatus, getPredictionById } from '../../services';
import { fileUploadStatus } from '../../constants';

const HistoryData: React.FC = () => {
    const [state, setState] = useState({
        modelType: 'fileUpload',
        loading: true,
        chooseFileLoading: false,
        message: '',
        fileName: '',
        file: null,
        initialLoading: false
    });
    const navigate = useNavigate();
    const formData = new FormData();
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<any>(null);

    const setFormData = (values: any) => {
        setState((prevState: any) => ({
            ...prevState,
            ...values
        }));
    };

    const checkPredictionCompleted = (id: string) => {
        intervalRef.current = setInterval(async () => {
            try {
                const { completed, failed } = fileUploadStatus;
                const { data } = await getPredictionById(id);
                if (data.status === completed) {
                    setFormData({
                        modelType: 'success'
                    });
                    clearInterval(intervalRef.current);
                }
                if (data.status === failed) {
                    setFormData({
                        modelType: 'error'
                    });
                    clearInterval(intervalRef.current);
                }
            } catch (err) {
                console.log(err);
            }
        }, 1 * 60000);   // Every two minutes
    };

    const onSubmit = async () => {
        try {
            setFormData({
                loading: true,
                chooseFileLoading: true
            });
            const name = state.fileName.split('.');
            formData.append('fileName', `${name[0]}.csv`);
            formData.append('file', state.file || '');
            const data: any = await uploadHistoricData(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: any) => {
                    setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
                },
            });
            setFormData({
                modelType: 'training'
            });
            checkPredictionCompleted(data.predictionId);
        } catch (err: any) {
            setFormData({
                message: err.message
            });
        } finally {
            setFormData({
                loading: false,
                chooseFileLoading: false
            });
        }
    };

    const onChangeText = ({ target: { value } }: any) => {
        setFormData({
            fileName: value
        });
    };

    const onFileChange = ({ target: { files } }: any) => {
        setFormData({
            fileName: files[0].name.replace('.csv', ''),
            file: files[0],
            loading: false
        });
    };

    const getPredictionStatus = async () => {
        try {
            setFormData({
                initialLoading: true,
            });
            const { data }: any = await checkPredictionStatus();
            if (data.historic && data.status === fileUploadStatus.pending) {
                setFormData({
                    modelType: 'training'
                });
                checkPredictionCompleted(data.predictionId);
            }
        } finally {
            setFormData({
                initialLoading: false,
            });
        }
    };

    useEffect(() => {
        getPredictionStatus();
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className="upload-history-blk">
            <div>
                <h1 className='h1-text'>Upload and run historic data <span><img src={historicLogo} /></span></h1>
            </div>
            {state.message && <div className='error-message'>
                <p>{state.message}</p>
            </div>}
            {state.initialLoading ? <div className='file-upload-loader'><Loading /></div> : <>
                {(state.modelType === 'fileUpload') &&
                    <FileUpload
                        clickHandler={onSubmit}
                        onChangeFile={onFileChange}
                        acceptedFiles='.csv'
                        chooseFileLoading={state.chooseFileLoading}
                        submitLoading={state.loading}
                        value={state.fileName}
                        onChangeText={onChangeText}
                        progress={progress}
                    />
                }
                {/* model training */}
                {(state.modelType === 'training') &&
                    <div className='waiting-time-blk'>
                        <div className='waiting-time-content'>
                            <div className='flex items-center justify-center pb-5'><img src={TimeIcon} /></div>
                            <h3>The model is currently being trained. You will receive an email once it has successfully uploaded or failed.</h3>
                            <p>This may take up to 3-4 hours to complete depending on your file size. The model is cloud-based and will continue to run even if your computer is in sleep mode.</p>
                            <div className="waiting-spinner">
                                <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    </div>
                }
                {/* end */}

                {/* model trained successfully*/}
                {(state.modelType === 'success') &&
                    <div className='waiting-time-blk'>
                        <div className='waiting-time-content'>
                            <div className='upload-success-icon'><img src={GreenTickIcon} /></div>
                            <h3>The model has successfully been trained.</h3>
                            <p>The model training has been completed. You can now upload future data files, after which you can view or download predictions.</p>
                            <div className='footer-btn'>
                                <Button text='Upload future data' onClick={() => { navigate('/upload-future-data'); }} addClass='success-btn w-3/5 sm:w-full'></Button>
                            </div> <div className='success-model-btn '>
                                <Button text='Home' onClick={() => { navigate('/dashboard'); }} addClass='success-btn w-3/5 sm:w-full'></Button>
                            </div>
                        </div>
                    </div>
                }
                {/* end */}

                {/* model training failed*/}
                {(state.modelType === 'error') &&
                    <div className='waiting-time-blk'>
                        <div className='waiting-time-content'>
                            <div className='upload-success-icon'><img src={ErrorIcon} /></div>
                            <h3>The model has failed while training.</h3>
                            <p>The model training has been failed. Please try again.</p>
                            <div className='footer-btn'>
                                <Button text='Upload historic data' onClick={() => {
                                    setFormData({
                                        modelType: 'fileUpload'
                                    });
                                }} addClass='success-btn w-3/5 sm:w-full'></Button>
                            </div> <div className='success-model-btn '>
                                <Button text='Home' onClick={() => { navigate('/dashboard'); }} addClass='success-btn w-3/5 sm:w-full'></Button>
                            </div>
                        </div>
                    </div>
                }
                {/* end */}
            </>}
        </div>
    );
};

export default HistoryData;