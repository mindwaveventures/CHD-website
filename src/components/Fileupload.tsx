import React from 'react';
import '../style/components/fileUpload.css';
import Button from './Button';
import '../style/components/button.css';
import '../style/components/textinput.css';
import { useLocation } from 'react-router-dom';

export interface FileUploadProps {
    clickHandler: (e: any) => void;
    acceptedFiles?: string;
    onChangeFile: (e: any) => void;
    submitLoading: boolean;
    value: string;
    onChangeText: (e: any) => void;
    chooseFileLoading?: boolean
    progress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
    clickHandler,
    acceptedFiles,
    onChangeFile,
    submitLoading,
    value,
    onChangeText,
    chooseFileLoading,
    progress
}) => {
    const location: any = useLocation();

    return (
        <div className="file-upload-blk">
            <div className='waiting-time-blk'>
                {location.pathname.includes('history') &&
                    <div className='waiting-time-content'>
                        <h3>Choose a historic data file to upload from your device:</h3>
                    </div>
                }
                {location.pathname.includes('future') &&
                    <div className='waiting-time-content'>
                        <h3>Choose a future data file to upload from your device:</h3>
                    </div>
                }
                <div className='footer-btn'>
                    <label htmlFor='fileUpload'>
                        Choose File
                        <input id='fileUpload' disabled={chooseFileLoading} accept={acceptedFiles || '*'} onChange={onChangeFile} type='file' />
                    </label>
                </div>
                {!value ? <div className="input-group">
                    <label>You have selected:</label>
                    <p className={` disabled-field ${!value ? 'disabled-placeholder' : ''}`}>{value ? value : 'Please select a CSV file '}</p>
                </div> : <div className={'input-group'}>
                    <div className='flex'>
                        <label>You have selected:</label>
                    </div>
                    <div className='relative'>
                        <input
                            className='text-field'
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Please select a CSV file "
                            value={value}
                            disabled={!value}
                            onChange={onChangeText}
                        />
                    </div>
                    {progress && progress > 0 ? <div>
                        <div className='progress-header'>
                            <p className='progress-title'>File upload in progress</p>
                            <span>{progress}%</span>
                        </div>
                        <div className="progess-bg">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div> : null}
                </div>}
            </div>
            <div className='footer-btn'>
                <Button text='Start' onClick={clickHandler} addClass='success-btn' disabled={submitLoading}></Button>
            </div>
        </div>
    );
};

export default FileUpload;