import React, { useEffect, useState, useRef } from 'react';
import {
  useNavigate
} from 'react-router-dom';
import '../../style/components/userTable.css';
import {
  Table,
  Button,
  Popup
} from '../../components';
import {
  getAllTrustByStatus,
  editTrust,
  retryStroageAccountCreation
} from '../../services/trust';
import { trustStatus, storageAccountStatus } from '../../constants';
import dayjs from 'dayjs';
import Tooltip from '../../components/Tooltip';
import { ReactComponent as Infoicon } from '../../assets/images/InfoIcon.svg';


const ActiveOrganisation: React.FC = () => {
  const navigate = useNavigate();
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
  const [retryId, setRetryId] = useState<string>('');
  const [retryLoading, setRetryLoading] = useState<boolean>(false);
  const ref = useRef('');

  const InfoComponent = () => {
    return <div className='account-status'><span>Status </span> <Infoicon className='icon-style' onClick={() => setShowmodal('status')} /></div>;
  };

  const Status = ()=>{
    return <div className='status-popup'>
    <p><span>Created:  </span><br /> Your account storage has been successfully created.</p>
    <p><span>In Progress:  </span><br /> Your account storage is in progress.</p>
    <p><span>Try Again:  </span><br /> We have not been able to create your account. Please try again.</p>
    </div>;
  };

  const columnData = [
    {
      name: 'Organisation name',
      selector: (row: any) => (
        <div
          onMouseEnter={() => showTooltip(true)}
          onMouseLeave={() => {
            showTooltip(false);
            setTimeout(() => showTooltip(true), 50);
          }}
          className='textover'
          data-tip
          data-for={`Organisationname${row.id}`}
        >
          {row.name}
          <Tooltip status={tooltip} id={`Organisationname${row.id}`}>
            <span>{row.name}</span>
          </Tooltip>
        </div>
      ),
      sorting: true,
    },
    {
      name: 'Date',
      selector: (row: any) => row.date,
      width: '150px',
    },
    {
      name: 'Email',
      selector: (row: any) => {
        if (row.emails.length > 1) {
          if (hideAndShow[row.id]) {
            return (
              <div>
                <div
                  onMouseEnter={() => showTooltip(true)}
                  onMouseLeave={() => {
                    showTooltip(false);
                    setTimeout(() => showTooltip(true), 50);
                  }}
                  className='textover'
                  data-tip
                  data-for={`email${row.id}`}
                >
                  <div>
                    {row.emails.map((item: any) => {
                      return (
                        <div key={item}>
                          <div key={item}>{item}</div>
                        </div>
                      );
                    })}
                  </div>
                  <Tooltip status={tooltip} id={`email${row.id}`}>
                    <span>{row.emails.map((item: any) => `${item}\n`)}</span>
                  </Tooltip>
                </div>
                <div
                  className='link'
                  onClick={() => {
                    setHideAndShow((prevState: any) => ({
                      ...prevState,
                      [row.id]: false,
                    }));
                  }}
                >
                  Hide all
                </div>
              </div>
            );
          }
          return (
            <div>
              <div
                onMouseEnter={() => showTooltip(true)}
                onMouseLeave={() => {
                  showTooltip(false);
                  setTimeout(() => showTooltip(true), 50);
                }}
                className='textover'
                data-tip
                data-for={`email${row.id}`}
              >
                <div>
                  <div>{row.emails[0]}</div>
                </div>
                <Tooltip status={tooltip} id={`email${row.id}`}>
                  <span>{row.emails[0]}</span>
                </Tooltip>
              </div>
              <div
                className='link'
                onClick={() => {
                  setHideAndShow((prevState: any) => ({
                    ...prevState,
                    [row.id]: true,
                  }));
                }}
              >
                {''}
                Show all
              </div>
            </div>
          );
        } else {
          return (
            <div
              onMouseEnter={() => showTooltip(true)}
              onMouseLeave={() => {
                showTooltip(false);
                setTimeout(() => showTooltip(true), 50);
              }}
              className='textover'
              data-tip
              data-for={`email${row.id}`}
            >
              <div>{row.emails[0]}</div>
              <Tooltip status={tooltip} id={`email${row.id}`}>
                <span>{row.emails[0]}</span>
              </Tooltip>
            </div>
          );
        }
      },
    },
    {
      name: <InfoComponent />,
      cell: (row: any) => {
        if (row.accountStatus === storageAccountStatus.success) {
          return (
            <div className='status-text'>
              <p>Created</p>
            </div>
          );
        } else if (row.accountStatus === storageAccountStatus.inprogress) {
          return (
            <div className='status-text-progress'>
              <p>In Progress</p>
            </div>
          );
        } else if (row.accountStatus === storageAccountStatus.failed) {
          return (
            <div>
              <Button
                addClass='status-error-btn'
                text='Try again'
                onClick={() => {
                  setShowmodal('tryAgain');
                  setCurrentOrganisation(row.id);
                  ref.current = row.name;
                }}
              />
            </div>
          );
        }
      },
      width: '150px',
    },

    {
      name: '',
      cell: (row: any) => (
        <Button
          addClass='secondary-btn'
          text='View'
          onClick={() =>
            navigate(`/organisation-users/${row.id}/${row.name}`)
          }
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
    {
      name: '',
      cell: (row: any) => (
        <Button
          addClass='secondary-btn'
          text='Edit'
          onClick={() =>
            navigate(`/edit-organisations/${row.id}/${row.name}`)
          }
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
    {
      name: '',
      cell: (row: any) => (
        <Button
          addClass="secondary-btn"
          text="Archive"
          onClick={() => {
            setCurrentOrganisation(row.id);
            setErrMessage('');
            setShowmodal('archive');
          }}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  const onClickTragain = async () => {
    try {
      setRetryLoading(true);
      await retryStroageAccountCreation(retryId);
      await getOrganisation();
    } finally {
      setRetryLoading(false);
      setShowmodal('');
    }
  };

  const getOrganisation = async () => {
    try {
      setOrganisationLoading(true);
      const { rows, count }: any = await getAllTrustByStatus({
        status: trustStatus.active,
        limit: pagination.rowPerPage,
        page: pagination.page
      });
      setTotalRow(count);
      const reformedData = rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        date: dayjs(item.createdAt).format('DD/MM/YYYY'),
        emails: item.email,
        accountStatus: item.accountStatus
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
        status: trustStatus.archived
      });
      await getOrganisation();
    } catch (err: any) {
      setErrMessage(err.message || '');
    } finally {
      setLoading(false);
      setShowmodal('');
    }
  };

  useEffect(() => {
    getOrganisation();
  }, [pagination]);

  useEffect(() => {
    if (retryId) {
      onClickTragain();
    }
  }, [retryId]);

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
      {showModal === 'archive' &&
        <Popup addClass='h-250' onBtnClick={updateOrganisation} onClose={() => {
          setShowmodal('');
        }} loading={loading} headerText='Are you sure want to archive ?'
          btnText='OK'
        />
      }

      {showModal === 'tryAgain' &&
        <Popup
          addClass='h-250'
          onClose={() => {
            setShowmodal('');
          }}
          loading={retryLoading}
          headerText={`Would you like to create your storage account ${ref.current || ''} again?`}
          btnText='OK'
          onBtnClick={() => {
            setRetryId(currentOrganisation);
            setShowmodal('');
          }}
        />
      }

      {showModal === 'status' &&
        <Popup addClass='h-250' onClose={() => {
          setShowmodal('');
        }}
          headerText='This column shows whether your account has been created or if that process is still in progress.'
          status={<Status/>}
          btnText='OK'
          onBtnClick={() => {
            setShowmodal('');
          }}
        />
      }
    </>
  );
};

export default ActiveOrganisation;