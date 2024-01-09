import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { getUsersByTrust } from '../../services';
import { userStatus, getUserType } from '../../constants';
import { capitalizeFirstLetter, getLocalStorage } from '../../utils';
import { LocalStorageUserDetails } from '../../types';
import Tooltip from '../../components/Tooltip';


function RejectedUser() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [totalRow, setTotalRow] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        rowPerPage: 10
    });

    const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');
    const [tooltip, showTooltip] = useState(true);

    const columnData = [
        {
            name: 'Name',
            selector: (row: any) => capitalizeFirstLetter(row.name),
        },
        {
            name: 'Role',
            selector: (row: any) => getUserType(row.role),
        },
        {
            name: 'Email',
            selector: (row: any) => (
                <div onMouseEnter={() => showTooltip(true)}
                    onMouseLeave={() => {
                        showTooltip(false);
                        setTimeout(() => showTooltip(true), 50);
                    }}
                    className="textover" data-tip data-for={`email${row.id}`}>{row.email}
                    <Tooltip status={tooltip} id={`email${row.id}`}>
                        <span>{row.email}</span>
                    </Tooltip>
                </div>
            ),
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
            width: '250px',
            wrap: false,
        }
    ];

    const getUsers = async () => {
        try {
            const { rows, count }: any = await getUsersByTrust({
                status: userStatus.rejected,
                trustId: userDetails.trustId || '',
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const formedData = rows.map((item: any) => ({
                id: item.id,
                name: item.firstName + ' ' + item.lastName,
                email: item.email,
                role: item.usertype,
                reason: item.reason
            }));
            setUsers(formedData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, [pagination]);

    return <div>








        <Table
            columns={columnData}
            data={users}
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

    </div>;
}

export default RejectedUser;
