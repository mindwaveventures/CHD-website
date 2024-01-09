import React, { useState } from 'react';
import '../style/components/popup.css';
import Button from './Button';
import '../style/components/button.css';


export interface PopupProps {
    headerText?: string;
    primaryContent?: string;
    secondaryContent?: string;
    btnText?: string;
    infoIcon?: boolean;
    showPopup?: boolean;
    textAreaContent?: string;
    addClass?: any;
    textArea?: boolean
    textAreaName?: string;
    loading?: boolean;
    onBtnClick?: any;
    onChangeTextArea?: any;
    onClose?: any;
    note?:string;
    closeIcon?: boolean;
    status?: any;
}

const Popup: React.FC<PopupProps> = (props) => {
    const [showModal, setShowModal] = useState(true);

    return (
        <div className={`${(showModal) ? 'popup' : 'd-none'}`}>
            <div className={`popup_inner ${props.addClass}`}>
                {props.closeIcon ? <></> : <div className='cross-icon'>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => {
                        if (props.onClose) {
                            props.onClose();
                        }
                        setShowModal(false);
                    }}></i>
                </div>}
                {props.headerText &&
                    <div className='header-section'>
                        {props.infoIcon && <i className='fa fa-info-circle'>
                        </i>}
                        <h1 className='h1-text'>{props.headerText}</h1>
                    </div>
                }
                {(props.primaryContent || props.secondaryContent) &&
                    <div className='popup-content'>
                        <p>{props.primaryContent}</p>
                        <p>{props.secondaryContent}</p>
                    </div>
                }
                {props.status && <>{props.status}</>}
                {props.textArea && (
                    <div className='popup-area-blk'>
                        <label>{props.textAreaName}</label>
                            <textarea className='popup-textarea' maxLength={500} onChange={props.onChangeTextArea} />
                            <p className='textarea-note'>{props.note}</p>
                    </div>
                )}
                {props.btnText &&
                    <div className='popup-footer-btn'>
                        <Button addClass='primary-btn' disabled={props.loading} text={props.btnText} onClick={async () => {
                            await props.onBtnClick();
                            setShowModal(false);
                        }} />
                    </div>
                }
            </div>
        </div>
    );
};

export default Popup;