import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Popup
} from '../../components';
import { getUsersByTrust, manageUserRequest } from '../../services';
import { userStatus, getUserType } from '../../constants';
import { capitalizeFirstLetter, getLocalStorage } from '../../utils';
import { LocalStorageUserDetails } from '../../types';
import Tooltip from '../../components/Tooltip';

function PendingInvite() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showModal, setShowmodal] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [reason, setReason] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [manageLoading, setManageLoading] = useState(false);
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
            selector: (row: any) => (
                <div
                    onMouseEnter={() => showTooltip(true)}
                    onMouseLeave={() => {
                        showTooltip(false);
                        setTimeout(() => showTooltip(true), 50);
                    }}
                    className='textover'
                    data-tip
                    data-for={`name${row.id}`}
                >
                    {capitalizeFirstLetter(row.name)}
                    <Tooltip status={tooltip} id={`name${row.id}`}>
                        <span>{row.name}</span>
                    </Tooltip>
                </div>
            ),
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
            width: '250px'
        },
        {
            name: '',
            cell: (row: any) => <Button addClass='secondary-btn' text='Accept' onClick={() => {
                setShowmodal('Accept');
                setCurrentUser(row.id);
            }} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        },
        {
            name: '',
            cell: (row: any) => <Button addClass='secondary-btn' text='Reject' onClick={() => {
                setShowmodal('Reject');
                setCurrentUser(row.id);
            }} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        },
    ];

    const getUsers = async () => {
        try {
            setLoading(true);
            const { rows, count }: any = await getUsersByTrust({
                status: userStatus.requested,
                trustId: userDetails.trustId || '',
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const formedData = rows.map((item: any) => ({
                id: item.id,
                name: item.firstName + ' ' + item.lastName,
                email: item.email,
                role: item.usertype
            }));
            setUsers(formedData);
        } finally {
            setLoading(false);
        }
    };

    const acceptUser = async () => {
        try {
            setManageLoading(true);
            await manageUserRequest({
                userid: currentUser,
                status: userStatus.active
            });
            await getUsers();
        } catch (err: any) {
            setErrMessage(err.message || '');
        } finally {
            setManageLoading(false);
            setShowmodal('');
        }
    };

    const rejectUser = async () => {
        try {
            setManageLoading(true);
            await manageUserRequest({
                userid: currentUser,
                status: userStatus.rejected,
                reason
            });
            await getUsers();
        } catch (err: any) {
            setErrMessage(err.message || '');
        } finally {
            setManageLoading(false);
            setShowmodal('');
        }
    };

    useEffect(() => {
        getUsers();
    }, [pagination]);

    return <div>
        {errMessage && <div className='error-message'>
            <p>{errMessage}</p>
        </div>}
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
        {
            showModal === 'Accept' &&
            <Popup
                addClass='h-250'
                onBtnClick={acceptUser}
                loading={manageLoading}
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
                onChangeTextArea={(event: any) => {
                    setReason(event.target.value);
                }}
                onBtnClick={rejectUser}
                loading={manageLoading}
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
    </div>;
}

export default PendingInvite;
