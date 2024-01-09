import React, { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import fileDownload from 'js-file-download';
import '../../style/components/userTable.css';
import { Button, Popup, Table, Selectoption } from '../../components';
import { ReactComponent as Infoicon } from '../../assets/images/InfoIcon.svg';
import {
    downloadPrediction,
    getPredictionByOrganisation,
    getAllTrustNameAndId,
    getUsernameAndIdByTrustId,
    getPredictionByUser
} from '../../services';
import { usertypes } from '../../constants';
import { getLocalStorage } from '../../utils';
import { convertMStoHours } from '../../utils';
import Tooltip from '../../components/Tooltip';

const Predictions: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDownloadModel, setShowDownloadModel] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const userDetails = getLocalStorage('userDetails');
    const [tooltip, showTooltip] = useState(true);
    const [state, setFormState] = useState({
        loading: false,
        data: [],
        count: 0,
        page: 1,
        limit: 10,
        trustId: userDetails.trustId || '',
        userId: 'all',
        organisationList: [{ value: '', label: 'Select' }],
        userList: [{ value: 'all', label: 'All' }]
    });

    const InfoComponent = () => {
        return <div className='time-col-blk'><span>Remaining time </span> <Infoicon className='icon-style' onClick={() => setShowModal(true)} /></div>;
    };

    const columnData = [
        {
            name: 'File name',
            selector: (row: any) => row.name,
            sorting: true
        },
        {
            name: 'Expiry date',
            selector: (row: any) => dayjs(row.date).format('DD/MM/YYYY'),
        },
        {
            name: 'Username',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div
                        onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className='textover'
                        data-tip
                        data-for={`Username${id}`}
                    >
                        {row.userName}
                        <Tooltip status={tooltip} id={`Username${id}`}>
                            <span>{row.userName}</span>
                        </Tooltip>
                    </div>
                );
            },
            sorting: true,
        },
        {
            name: <InfoComponent />,
            selector: (row: any) => {
                const milliseconds = dayjs(row.date).diff(dayjs(row.currentDate));
                if (milliseconds > 0) {
                    return convertMStoHours(milliseconds);
                }
                return 'Expired';
            },
            sorting: true,
            width: '230px'
        },
        {
            name: '',
            cell: (row: any) => {
                const milliseconds = dayjs(row.date).diff(dayjs(row.currentDate));
                if (milliseconds > 0) {
                    return <Button addClass='secondary-btn' disabled={showDownloadModel} text='Download' onClick={() => {
                        onDownload(row.id);
                    }} />;
                }
                return <></>;
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        }
    ];

    const setState = (data: any) => {
        setFormState((prevState: any) => ({
            ...prevState,
            ...data
        }));
    };

    const onDownload = async (id: string) => {
        try {
            setShowDownloadModel(true);
            const data: any = await downloadPrediction(id);
            fileDownload(data.data, data.headers['file-name']);
        } catch (err) {
            setErrorMessage('Something went wrong on download');
        } finally {
            setShowDownloadModel(false);
        }
    };

    const getCompletedPredictions = async () => {
        try {
            if (userDetails.usertype === usertypes.superAdmin && (!state.trustId || !state.userId)) {
                return;
            }
            setState({
                loading: true
            });
            let data: any = null;
            if (userDetails.usertype === usertypes.superAdmin) {
                const val = await getPredictionByOrganisation({
                    limit: state.limit,
                    page: state.page,
                    trustId: state.trustId,
                    userId: state.userId
                });
                data = val.data;
            } else {
                const val = await getPredictionByUser({
                    limit: state.limit,
                    page: state.page,
                    trustId: userDetails.trustId,
                    userId: state.userId
                });
                data = val.data;
            }
            setState({
                loading: false,
                data: data.rows,
                count: data.count
            });
        } catch (err) {
            setState({
                loading: false
            });
        }
    };

    const getAllOrganisation = async () => {
        try {
            const data: any = await getAllTrustNameAndId();
            const mappedData = data.rows.map((item: any) => ({
                label: item.name,
                value: item.id
            }));
            mappedData.unshift({ value: '', label: 'Select' });
            setState({
                organisationList: mappedData,
                userList: [{ value: 'all', label: 'All' }],
                userId: 'all'
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onSelectChange = (event: any) => {
        const { value, name } = event.target;
        setState({
            [name]: value
        });
    };

    const getUserList = async () => {
        try {
            const trustValue = usertypes.superAdmin ? state.trustId : userDetails.trustId;
            const { data } = await getUsernameAndIdByTrustId(trustValue);
            const mappedData = data.map((item: any) => ({
                label: item.firstName + ' ' + item.lastName,
                value: item.id
            }));
            mappedData.unshift({
                value: 'all', label: 'All'
            });
            setState({
                userList: mappedData
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (userDetails.usertype === usertypes.superAdmin) {
            getAllOrganisation();
        }
    }, []);

    useEffect(() => {
        if (state.trustId) {
            getUserList();
        }
    }, [state.trustId]);

    useEffect(() => {
        getCompletedPredictions();
    }, [state.page, state.userId, state.trustId]);

    return (
        <Fragment>
            <div className="user-table-blk">
                <div>
                    <div>
                        <h1 className='h1-text'>Previous predictions</h1>
                    </div>
                    <div className='admin-prediction select-audit'>
                        <div className='table-filter-option'>
                            {userDetails.usertype === usertypes.superAdmin && <Selectoption
                                label='Organisation'
                                name='trustId'
                                options={state.organisationList}
                                value={state.trustId}
                                onChange={onSelectChange}
                            />}
                            {userDetails.usertype !== usertypes.clinician && <Selectoption
                                label='Select user'
                                name='userId'
                                options={state.userList}
                                value={state.userId}
                                onChange={onSelectChange}
                            />}
                        </div>
                    </div>
                    {errorMessage && <div className='error-message'>
                        <p>{errorMessage}</p>
                    </div>}
                    <Table
                        columns={columnData}
                        data={state.data}
                        progressPending={state.loading}
                        paginationTotalRows={state.count}
                        onChangePage={(page: number) => {
                            setState({
                                page
                            });
                        }}
                        onChangeRowsPerPage={(rowPerPage: number, page: number) => {
                            setState({
                                page,
                                limit: rowPerPage
                            });
                        }}
                        predictionTable={(userDetails.usertype === usertypes.superAdmin && !state.trustId)}
                    />
                </div>
            </div>
            {showModal &&
                <Popup primaryContent={'The download option for predictions is available for 24 hours.'}
                    secondaryContent={'If you wish to download the same prediction file, please re-upload the future data file.'}
                    headerText={'Remaining time'}
                    btnText={'Close'} onBtnClick={() => setShowModal(false)} showPopup={true} onClose={() => setShowModal(false)} />}
            {showDownloadModel &&
                <Popup
                    headerText='Prediction Data' primaryContent='Your prediction data is downloading. Please wait...' btnText='Ok'
                    onBtnClick={() => setShowDownloadModel(false)} loading={true} closeIcon={true} showPopup={true} onClose={() => setShowDownloadModel(false)}
                />}
        </Fragment>
    );
};

export default Predictions;