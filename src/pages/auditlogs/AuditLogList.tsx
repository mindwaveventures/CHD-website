import React, { useEffect, useState } from 'react';
import '../../style/components/userTable.css';
import { Selectoption, Table, CustomDatePicker } from '../../components';
import { getAuditLogs, getAllTrustNameAndId, getAllAuditLogForAdmin } from '../../services';
import dayjs from 'dayjs';
import Tooltip from '../../components/Tooltip';
import { usertypes } from '../../constants';
import { getLocalStorage } from '../../utils';
import { LocalStorageUserDetails } from '../../types';

const AuditLogList = () => {
    const columnData = [
        {
            name: 'Date',
            selector: (row: any) => dayjs(row.date).format('DD/MM/YYYY'),
            sorting: true
        },
        {
            name: 'User name',
            minWidth: '150px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Username${id}`}>{row.name}
                        <Tooltip status={tooltip} id={`Username${id}`}>
                            <span>{row.name}</span>
                        </Tooltip>
                    </div>
                );
            },
            sorting: true
        },
        {
            name: 'Email',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Email${id}`}>{row.email}
                        <Tooltip status={tooltip} id={`Email${id}`}>
                            <span>{row.email}</span>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            name: 'Time',
            selector: (row: any) => dayjs(row.date).format('HH:mm'),
        },
        {
            name: 'Action Performed',
            width: '200px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Actionperformed${id}`}>{row.log}
                        <Tooltip status={tooltip} id={`Actionperformed${id}`}>
                            <span>{row.log}</span>
                        </Tooltip>
                    </div>
                );
            },
        }
    ];

    const organisationColumn = [
        {
            name: 'Date',
            selector: (row: any) => dayjs(row.date).format('DD/MM/YYYY'),
            sorting: true
        },
        {
            name: 'User name',
            minWidth: '150px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Username${id}`}>{row.name}
                        <Tooltip status={tooltip} id={`Username${id}`}>
                            <span>{row.name}</span>
                        </Tooltip>
                    </div>
                );
            },
            sorting: true
        },
        {
            name: 'Email',
            minWidth: '200px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Email${id}`}>{row.email}
                        <Tooltip status={tooltip} id={`Email${id}`}>
                            <span>{row.email}</span>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            name: 'Organisation name',
            minWidth: '200px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Organisationname${id}`}>{row.trustName}
                        <Tooltip status={tooltip} id={`Organisationname${id}`}>
                            <span>{row.trustName}</span>
                        </Tooltip>
                    </div>
                );
            },
            sorting: true
        },
        {
            name: 'Time',
            selector: (row: any) => dayjs(row.date).format('HH:mm'),
        },
        {
            name: 'Action performed',
            width: '200px',
            selector: (row: any) => {
                const uniqueId = 'id' + Math.random().toString(16).slice(2);
                const id = row && row.id ? row.id : uniqueId;
                return (
                    <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                        }}
                        className="textover" data-tip data-for={`Actionperformed${id}`}>{row.log}
                        <Tooltip status={tooltip} id={`Actionperformed${id}`}>
                            <span>{row.log}</span>
                        </Tooltip>
                    </div>
                );
            },
        }
    ];

    const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');

    const [logs, setLogs] = useState([{
        dayjs: new Date(),
        name: 'test',
        log: 'something',
        email: 'someting@gmail.com',
        organisationName: 'somethin world'
    }]);
    const [loading, setLoading] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        rowPerPage: 10
    });
    const [tooltip, showTooltip] = useState(true);
    const [state, setFormData] = useState({
        organisationList: [{
            label: 'All',
            value: 'all'
        }],
        currentOrganisation: 'all',
        fromDate: null,
        toDate: null,
        columnData: userDetails.usertype === usertypes.superAdmin ? organisationColumn : columnData,
    });

    const setState = (values: any) => {
        setFormData((prevState: any) => ({
            ...prevState,
            ...values
        }));
    };

    const getLogs = async () => {
        try {
            setLoading(true);
            let dataValues = [];
            let dataCount = 0;
            if (userDetails.usertype === usertypes.superAdmin) {
                const { data, count }: any = await getAllAuditLogForAdmin({
                    fromDate: state.fromDate,
                    toDate: state.toDate,
                    organisationId: state.currentOrganisation,
                    page: pagination.page,
                    limit: pagination.rowPerPage
                });
                dataValues = data;
                dataCount = count;
            } else {
                const { data, count }: any = await getAuditLogs({
                    fromDate: state.fromDate,
                    toDate: state.toDate,
                    page: pagination.page,
                    limit: pagination.rowPerPage
                });
                dataValues = data;
                dataCount = count;
            }
            setTotalRow(dataCount);
            setLogs(dataValues);
        } finally {
            setLoading(false);
        }
    };

    const onSelectChange = (event: any) => {
        const { value, name } = event.target;
        if (value === 'all') {
            setState({
                [name]: value,
                columnData: organisationColumn
            });
        } else {
            setState({
                [name]: value,
                columnData: columnData
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
            mappedData.unshift({
                label: 'All',
                value: 'all'
            });
            setState({
                organisationList: mappedData
            });
        } finally {
            // test
        }
    };

    useEffect(() => {
        if (userDetails.usertype === usertypes.superAdmin) {
            getAllOrganisation();
        }
    }, []);

    useEffect(() => {
        getLogs();
    }, [pagination, state.fromDate, state.toDate, state.currentOrganisation]);

    return <>
        <div className="user-table-blk admin-audit">
            <div>
                <div>
                    <h1 className='h1-text'>Audit trail</h1>
                </div>
                <div className={`select-audit ${userDetails.usertype !== usertypes.superAdmin && 'admin-select'}`}>
                    {userDetails.usertype === usertypes.superAdmin && <div className='table-filter-option'>
                        <Selectoption
                            label='Select organisation'
                            name='currentOrganisation'
                            options={state.organisationList}
                            value={state.currentOrganisation}
                            onChange={onSelectChange}
                        />
                    </div>}
                    <div className='aduit-date-blk' >
                        <div className='audit-dates'>
                            <CustomDatePicker
                                label='From'
                                onChange={(date: string) => {
                                    setState({
                                        fromDate: date
                                    });
                                }}
                                value={state.fromDate}
                                name='fromDate'
                            />
                            <CustomDatePicker
                                label='To'
                                minDate={state.fromDate}
                                onChange={(date: any) => {
                                    setState({
                                        toDate: date
                                    });
                                }}
                                value={state.toDate}
                                name='toDate'
                            />
                        </div>
                    </div>
                </div>
                <Table
                    columns={state.columnData}
                    data={logs}
                    progressPending={loading}
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
            </div>
        </div>
    </>;
};

export default AuditLogList;
