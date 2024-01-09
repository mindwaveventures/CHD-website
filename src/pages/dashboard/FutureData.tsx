import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/components/historyData.css';
import '../../style/components/button.css';
import { FileUpload, Button, Loading } from '../../components';
import futureData from '../../assets/images/futureData.svg';
import { uploadFutureData, checkPredictionStatus, getPredictionById } from '../../services';
import ErrorIcon from '../../assets/images/ErrorIcon.svg';
import TimeIcon from '../../assets/images/TimeIcon.svg';
import { fileUploadStatus } from '../../constants';

const FutureData: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState({
        modelType: 'futureFileUpload',
        loading: true,
        chooseFileLoading: false,
        message: '',
        fileName: '',
        file: null,
        status: false,
        initialLoading: false
    });
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
                    navigate('/download-predictions');
                    clearInterval(intervalRef.current);
                }
                if (data.status === failed) {
                    setFormData({
                        modelType: 'futureError'
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
            const data: any = await uploadFutureData(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: any) => {
                    setProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
                },
            });
            setFormData({
                modelType: 'futureTraining'
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
            // if (!((data.historic && !data.progress) || data.future || data.expired)) {
            //     navigate('/dashboard');
            // }
            if (data.future && data.status === fileUploadStatus.pending) {
                checkPredictionCompleted(data.predictionId);
                setFormData({
                    modelType: 'futureTraining'
                });
            }
        } finally {
            setFormData({
                initialLoading: false,
            });
        }
    };

    useEffect(() => {
        getPredictionStatus();
    }, []);

    return (
        <div className="upload-history-blk">
            <div>
                <h1 className='h1-text'>Upload and run future data <span><img src={futureData} /></span></h1>
            </div>
            {state.message && <div className='error-message'>
                <p>{state.message}</p>
            </div>}
            {state.initialLoading ? <div className='file-upload-loader'><Loading /></div> : <>
                {(state.modelType === 'futureFileUpload') &&
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
                {(state.modelType === 'futureTraining') &&
                    <div className='waiting-time-blk'>
                        <div className='waiting-time-content'>
                            <div className='flex items-center justify-center pb-5'><img src={TimeIcon} /></div>
                            <h3>Your prediction is generating. Please check again later</h3>
                            <p>This may take up to 1 hour to complete depending on your file size. This prediction is cloud-based and will continue to run even if your computer is in sleep mode.</p>
                            <div className="waiting-spinner">
                                <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    </div>
                }
                {/* end */}
                {/* model trained failed*/}
                {(state.modelType === 'futureError') &&
                    <div className='waiting-time-blk'>
                        <div className='waiting-time-content'>
                            <div className='upload-success-icon'><img src={ErrorIcon} /></div>
                            <h3>Failed to generate prediction.</h3>
                            <p>Your prediction generation has been failed. Please try again.</p>
                            <div className='footer-btn'>
                                <Button text='Upload historic data' addClass='success-btn w-3/5 sm:w-full' onClick={() => {
                                    setFormData({
                                        modelType: 'futureFileUpload'
                                    });
                                }}></Button>
                            </div>
                            <div className='success-model-btn '>
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

export default FutureData;