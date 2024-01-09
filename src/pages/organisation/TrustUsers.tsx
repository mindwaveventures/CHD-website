import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../style/components/userTable.css';
import {
    Table,
    Button,
    Popup
} from '../../components';
import { getUsersByTrust, changeRole } from '../../services';
import { userStatus, usertypes, getUserType } from '../../constants';
import Tooltip from '../../components/Tooltip';


const TrustUsers: React.FC = () => {
    const [showModal, setShowmodal] = useState('');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [message, setMessage] = useState({
        status: false,
        message: '',
        type: ''
    });
    const [totalRow, setTotalRow] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        rowPerPage: 10
    });
    const [userFirstName, setUserFistName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const params = useParams();
    const [tooltip, showTooltip] = useState(true);
    const getCellName = (first : string, last : string, email: any) =>{
        setUserFistName(first);
        setUserLastName(last);
        setUserEmail(email);
    };
    const columnData = [
        {
            name: 'Firstname',
            selector: (row: any) => row.firstName
        },
        {
            name: 'Surname',
            selector: (row: any) => row.lastName
        },
        {
            name: 'Usertype',
            selector: (row: any) => getUserType(row.usertype),
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
            cell: (row: any) => {
                if (row.usertype === usertypes.admin) {
                    return <Button addClass='secondary-btn' text='Remove admin' onClick={() => {
                        getCellName(row.firstName, row.lastName, row.email);
                        setCurrentUser(row.id);
                        setShowmodal('Remove admin');
                    }} />;
                }
                return <Button addClass='secondary-btn' text='Make admin ' onClick={() => {
                    getCellName(row.firstName, row.lastName, row.email);
                    setCurrentUser(row.id);
                    setShowmodal('Make admin');
                    
                }} />;
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px',
        }
    ];

    const getUsers = async () => {
        try {
            setLoading(true);
            const { rows, count }: any = await getUsersByTrust({
                trustId: params.id || '',
                status: userStatus.active,
                limit: pagination.rowPerPage,
                page: pagination.page
            });
            setTotalRow(count);
            const formattedData = rows.map((item: any) => ({
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                email: item.email,
                usertype: item.usertype
            }));
            setUsers(formattedData);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (usertype: string) => {
        try {
            setUpdateLoading(true);
            await changeRole({
                usertype,
                id: currentUser,
                name: (params.name || '').trim()
            });
            await getUsers();
        } catch (err: any) {
            setMessage({
                status: true,
                message: err.message,
                type: 'Error'
            });
        } finally {
            setShowmodal('');
            setUpdateLoading(false);
        }
    };
   
    useEffect(() => {
        getUsers();
    }, [pagination]);

    return (
        <div className="user-table-blk">
            <div>
                <div>
                    <h1 className='h1-text'>{params.name || ''}  Users</h1>
                </div>
                {message.status && <div className={message.type === 'Error' ? 'error-message' : 'success-message'}>
                    <p>{message.message}</p>
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
                {showModal === 'Remove admin' &&
                    <Popup
                        addClass='h-250'
                        headerText={`Would you like to make ${userFirstName} ${userLastName} (${userEmail}) from admin to clinician ?`}
                        btnText='OK'
                        onClose={() => {
                            setShowmodal('');
                        }}
                        onBtnClick={() => {
                            updateUser(usertypes.clinician);
                        }}
                        loading={updateLoading}
                    />
                }
                {showModal === 'Make admin' &&
                    <Popup addClass='h-250'
                        headerText={`Would you like to make ${userFirstName} ${userLastName} (${userEmail}) from clinician to admin ?`}
                        btnText='OK'
                        onClose={() => {
                            setShowmodal('');
                        }}
                        onBtnClick={() => {
                            updateUser(usertypes.admin);
                        }}
                        loading={updateLoading}
                    />
                }
            </div>
        </div>
    );
};

export default TrustUsers;