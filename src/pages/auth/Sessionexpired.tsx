import React from 'react';
import { Popup } from '../../components';

interface SessionExpiryProps {
    onBtnClick: any;
    onClose: any
}

function Sessionexpired({
    onBtnClick,
    onClose
}: SessionExpiryProps) {
    return (
        <Popup
            addClass='h-250'
            headerText='Session expired'
            primaryContent='Your session has expired. Please sign in again to continue.'
            btnText='Okay'
            onBtnClick={onBtnClick}
            onClose={onClose}
        />
    );
}
export default Sessionexpired;