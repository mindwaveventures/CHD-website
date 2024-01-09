import React from 'react';
import '../../style/pages/organisationTable.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ActiveUser from './ActiveUsers';
import PendingUser from './PendingInvite';
import RejectedUser from './RejectedUsers';

const UserTable: React.FC = () => {
    const tabs = ['Active Users', 'Pending Invite', 'Rejected Invite'];

    return (
        <div className="user-table-blk">
            <div>
                <div>
                    <h1 className='h1-text'>Users</h1>
                </div>
                <Tabs>
                    <TabList>
                        {tabs.map((item: any, i: number) => (
                            <Tab key={i}>{item}</Tab>
                        ))}
                    </TabList>
                    <TabPanel>
                        <ActiveUser />
                    </TabPanel>
                    <TabPanel>
                        <PendingUser />
                    </TabPanel>
                    <TabPanel>
                        <RejectedUser />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};

export default UserTable;