import React from 'react';
import '../../style/components/userTable.css';
import ActiveOrganisation from './ActiveOrganisation';
import ArchievedOrganisations from './ArchievedOrganisations';
// import PendingOrganisation from './PendingOrganisation';
// import RejectedOrganisation from './RejectedOrganisation';
import '../../style/pages/organisationTable.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Button } from '../../components';
import { useNavigate } from 'react-router-dom';


const OrganisationTable: React.FC = () => {
    const tabs = ['Active organisations', 'Archived organisations'];
    const navigate = useNavigate();

    return (
        <div className="user-table-blk">
            <div>
                <div>
                    <h1 className='h1-text'>Registered Organisations</h1>
                </div>
            </div>
            <Tabs>
                <TabList>
                    {tabs.map((item: any, i: number) => (
                        <Tab key={i}>{item}</Tab>
                    ))}
                </TabList>
                <TabPanel>
                    <ActiveOrganisation />
                </TabPanel>
                <TabPanel>
                    <ArchievedOrganisations />
                </TabPanel>
                <div className='footer-table-btn'>
                    <Button addClass='success-btn' text='Invite an organisation' onClick={() => navigate('/invite-organisations')} />
                </div>
            </Tabs>
        </div>
    );
};

export default OrganisationTable;