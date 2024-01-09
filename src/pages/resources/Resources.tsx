import React, { useEffect, useState } from 'react';
import { Button, Popup, Table } from '../../components';
import { generatePDF, getResourcesFiles } from '../../services';
import './../../style/pages/resources.css';
import fileDownload from 'js-file-download';

interface state {
    loading: boolean;
    data: string[];
    isDownloading: boolean;
}

const Resources = () => {
    const [state, setState] = useState<state>({
        loading: true,
        data: [],
        isDownloading: false,
    });
    const [errorMessage, setErrorMessage] = useState('');



    const onDownload = async (name: string) => {
        try {
            setState((prev: any) => ({
                ...prev,
                isDownloading: true,
            }));
            const response = await generatePDF({
                fileName: name
            });
            fileDownload(response.data, name);
        } catch {
            setErrorMessage('Something went wrong');
        }
        finally {
            setState((prev: any) => ({
                ...prev,
                isDownloading: false,
            }));
        }
    };
    const columnData = [
        {
            name: 'Resource title',
            selector: (row: any) => row,
            sorting: true
        },
        {
            name: '',
            cell: (row: any) => {
                return <Button addClass='secondary-btn' disabled={false} text='Download' onClick={() => onDownload(row)} />;
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        }
    ];

    const getResources = async () => {
        try {
            setState((prev: any) => ({
                ...prev,
                loading: true,
            }));
            const response = await getResourcesFiles();
            setState((prev: any) => ({
                ...prev,
                data: response.data,
            }));
        } catch (err) {
            console.log(err);
        } finally {
            setState((prev: any) => ({
                ...prev,
                loading: false,
            }));
        }
    };

    useEffect(() => {
        getResources();
    }, []);

    return (
        <>
            <div className="resource-table-blk">
                <div>
                    <div>
                        <h1 className='h1-text'>Resources</h1>
                        <p>You can download resources and save them to your device in PDF format.</p>
                    </div>
                    {errorMessage && <div className='error-message'>
                        <p>{errorMessage}</p>
                    </div>}
                    <Table
                        columns={columnData}
                        data={state.data}
                        progressPending={state.loading}
                        hidePagination
                    // predictionTable={(userDetails.usertype === usertypes.superAdmin && !state.trustId)}
                    />
                </div>
            </div>
            {state.isDownloading &&
                <Popup
                    headerText='Resource'
                    primaryContent='Your file is downloading. Please wait...' btnText='Ok'
                    onBtnClick={() => setState((prev: any) => ({
                        ...prev,
                        isDownloading: false,
                    }))}
                    loading={true} closeIcon={true} showPopup={true}
                    onClose={() => setState((prev: any) => ({
                        ...prev,
                        isDownloading: false,
                    }))}
                />}
        </>
    );
};
export default Resources;