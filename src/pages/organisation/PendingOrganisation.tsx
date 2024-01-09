import React, { useEffect, useState } from 'react';
import '../../style/components/userTable.css';
import {
    Table,
    Button,
    Popup
} from '../../components';
import {
    getAllTrustByStatus,
    editTrust
} from '../../services/trust';
import { trustStatus } from '../../constants';
import dayjs from 'dayjs';
import Tooltip from '../../components/Tooltip';

const PendingOrganisations: React.FC = () => {
    const [showModal, setShowmodal] = useState('');
    const [organisationList, setOrganisationList] = useState([]);
    const [organisationLoading, setOrganisationLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [currentOrganisation, setCurrentOrganisation] = useState<string>('');
    const [reason, setReason] = useState('');
    const [totalRow, setTotalRow] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        rowPerPage: 10
    });
    const [tooltip, showTooltip] = useState(true);
    const columnData = [
        {
            name: 'Organisation name',
            selector: (row: any) =>  (
                <div onMouseEnter={() => showTooltip(true)}
                onMouseLeave={() => {
                    showTooltip(false);
                    setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Organisationname${row.id}`}>{row.name}
                <Tooltip status={tooltip} id={`Organisationname${row.id}`}>
                <span>{row.name}</span>
              </Tooltip>
              </div>
            ),
                    },
        {
            name: 'Email',
            selector: (row: any) => {
                return <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`email${row.id}`}>
                        <div>{row.email[0]}</div>
                        <Tooltip status={tooltip} id={`email${row.id}`}>
                            <span>{row.email[0]}</span>
                        </Tooltip>
                    </div>;
            }
        },      
        {
            name: 'Date',
            selector: (row: any) => row.date,
        },
        {
            name: '',
            cell: (row: any) => <Button addClass='secondary-btn' text='Accept' onClick={() => {
                setErrMessage('');
                setShowmodal('Accept');
                setCurrentOrganisation(row.id);
            }} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        },
        {
            name: '',
            cell: (row: any) => <Button addClass='secondary-btn' text='Reject' onClick={() => {
                setErrMessage('');
                setShowmodal('Reject');
                setCurrentOrganisation(row.id);
            }} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        },
    ];

    const getOrganisation = async () => {
        try {
            setOrganisationLoading(true);
            const { rows, count }: any = await getAllTrustByStatus({
                status: trustStatus.request,
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const reformedData = rows.map((item: any) => ({
                id: item.id,
                name: item.name,
                date: dayjs(item.createdAt).format('DD/MM/YYYY'),
                email: item.email
            }));
            setOrganisationList(reformedData);
        } finally {
            setOrganisationLoading(false);
        }
    };

    const updateOrganisation = async (status: string) => {
        try {
            setLoading(true);
            await editTrust({
                id: currentOrganisation,
                status,
                reason
            });
            await getOrganisation();
        } catch (err: any) {
            setErrMessage(err.message || '');
        } finally {
            setLoading(false);
            setShowmodal('');
        }
    };

    const onChangeTextArea = (event: any) => {
        const { value } = event.target;
        setReason(value);
    };

    useEffect(() => {
        getOrganisation();
    }, [pagination]);

    return (
        <>
            {errMessage && <div className='error-message'>
                <p>{errMessage}</p>
            </div>}
            <Table
                columns={columnData}
                data={organisationList}
                progressPending={organisationLoading}
                paginationTotalRows={totalRow}
                onChangePage={(page: number) => {
                    setPagination((prevState: any) => ({
                        ...prevState,
                        page
                    }));
                }}
                onChangeRowsPerPage={(rowPerPage: number, page: number) => {
                    setPagination({
                        page,
                        rowPerPage
                    });
                }}
            />
            {
                showModal === 'Accept' &&
                <Popup
                    addClass='h-250'
                    onBtnClick={async () => {
                        await updateOrganisation(trustStatus.active);
                    }}
                    loading={loading}
                    headerText='Are you sure you want to accept the invitation?'
                    btnText='OK'
                    onClose={() => {
                        setShowmodal('');
                    }}
                />
            }
            {
                showModal === 'Reject' &&
                <Popup
                    addClass='h-450'
                    onChangeTextArea={onChangeTextArea}
                    onBtnClick={async () => {
                        await updateOrganisation(trustStatus.rejected);
                    }}
                    loading={loading}
                    headerText='Are you sure you want to reject the invitation?'
                    btnText='OK'
                    textArea
                    textAreaName='Reason :'
                    note='Maximum 500 characters'
                    onClose={() => {
                        setShowmodal('');
                        setReason('');
                    }}
                />
            }
        </>
    );
};

export default PendingOrganisations;