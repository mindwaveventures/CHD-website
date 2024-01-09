import React, { useEffect, useState } from 'react';
import '../../style/components/userTable.css';
import { Table } from '../../components';
import { getAllTrustByStatus } from '../../services/trust';
import { trustStatus } from '../../constants';
import dayjs from 'dayjs';
import Tooltip from '../../components/Tooltip';

const PendingOrganisations: React.FC = () => {
    const [organisationList, setOrganisationList] = useState([]);
    const [organisationLoading, setOrganisationLoading] = useState(true);
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
            name: 'Reason',
            selector: (row: any) => (
                <div onMouseEnter={() => showTooltip(true)}
                        onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 50);
                                }}
                    className="textover" data-tip data-for={`reason${row.id}`}>{row.reason}
                <Tooltip status={tooltip} id={`reason${row.id}`}>
                <span>{row.reason}</span>
              </Tooltip>
                 </div>
               ),
               width: '200px',
               wrap:false,
        },
        {
            name: 'Date',
            selector: (row: any) => row.date,
        }
    ];

    const getOrganisation = async () => {
        try {
            setOrganisationLoading(true);
            const { rows, count }: any = await getAllTrustByStatus({
                status: trustStatus.rejected,
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const reformedData = rows.map((item: any) => ({
                id: item.id,
                name: item.name,
                date: dayjs(item.createdAt).format('DD/MM/YYYY'),
                reason: item.reason,
                email: item.email
            }));
            setOrganisationList(reformedData);
        } finally {
            setOrganisationLoading(false);
        }
    };

    useEffect(() => {
        getOrganisation();
    }, [pagination]);

    return (
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
    );
};

export default PendingOrganisations;