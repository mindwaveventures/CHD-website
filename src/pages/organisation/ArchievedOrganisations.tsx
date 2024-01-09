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

const ArchievedOrganisations: React.FC = () => {
    const [showModal, setShowmodal] = useState('');
    const [organisationList, setOrganisationList] = useState([]);
    const [organisationLoading, setOrganisationLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [currentOrganisation, setCurrentOrganisation] = useState<string>('');
    const [totalRow, setTotalRow] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        rowPerPage: 10
    });
    const [tooltip, showTooltip] = useState(true);
    const [hideAndShow, setHideAndShow] = useState<any>({});

    const columnData = [
        {
            name: 'Organisation name',
            selector: (row: any) => (
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
            name: 'Date',
            selector: (row: any) => row.date,
        },
        {
            name: 'Email',
            selector: (row: any) => {
                if (row.emails.length > 1) {
                    if (hideAndShow[row.id]) {
                        return <div>
                            <div onMouseEnter={() => showTooltip(true)}
                                onMouseLeave={() => {
                                    showTooltip(false);
                                    setTimeout(() => showTooltip(true), 50);
                                }}
                                className="textover" data-tip data-for={`email${row.id}`}>
                                <div>
                                    {row.emails.map((item: any) => {
                                        return <div key={item}>
                                            <div key={item}>{item}</div>
                                        </div>;
                                    })}
                                </div>
                                <Tooltip status={tooltip} id={`email${row.id}`}>
                                    <span>{row.emails.map((item: any) => `${item}\n`)}</span>
                                </Tooltip>
                            </div>
                            <div className='link' onClick={() => {
                                setHideAndShow((prevState: any) => ({
                                    ...prevState,
                                    [row.id]: false
                                }));
                            }}>Hide all</div>
                        </div>;
                    }
                    return <div>
                        <div onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                                showTooltip(false);
                                setTimeout(() => showTooltip(true), 50);
                            }}
                            className="textover" data-tip data-for={`email${row.id}`}>
                            <div>
                                <div >{row.emails[0]}</div>
                            </div>
                            <Tooltip status={tooltip} id={`email${row.id}`}>
                                <span>{row.emails[0]}</span>
                            </Tooltip>
                        </div>
                        <div className='link' onClick={() => {
                            setHideAndShow((prevState: any) => ({
                                ...prevState,
                                [row.id]: true
                            }));
                        }}>Show all</div>
                    </div>;
                } else {
                    return <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`email${row.id}`}>
                        <div>{row.emails[0]}</div>
                        <Tooltip status={tooltip} id={`email${row.id}`}>
                            <span>{row.emails[0]}</span>
                        </Tooltip>
                    </div>;
                }
            }
        },
        {
            name: '',
            cell: (row: any) => <Button addClass='secondary-btn' text='unarchive' onClick={() => {
                setShowmodal('unarchive');
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
                status: trustStatus.archived,
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const reformedData = rows.map((item: any) => ({
                id: item.id,
                name: item.name,
                date: dayjs(item.createdAt).format('DD/MM/YYYY'),
                emails: item.email
            }));
            setOrganisationList(reformedData);
        } finally {
            setOrganisationLoading(false);
        }
    };

    const updateOrganisation = async () => {
        try {
            setLoading(true);
            await editTrust({
                id: currentOrganisation,
                status: trustStatus.active
            });
            await getOrganisation();
        } catch (err: any) {
            setErrMessage(err.message || '');
        } finally {
            setLoading(false);
            setShowmodal('');
            setErrMessage('');
        }
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
                showModal === 'unarchive' &&
                <Popup
                    loading={loading}
                    addClass='h-250'
                    onClose={() => {
                        setShowmodal('');
                    }}
                    onBtnClick={updateOrganisation}
                    headerText={'Are you sure you want to unarchive ?'}
                    btnText={'OK'}
                />
            }
        </>
    );
};

export default ArchievedOrganisations;