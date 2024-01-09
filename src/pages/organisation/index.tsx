import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [
    {
        title: 'Organisation Table',
        component: lazy(() => import('./OrganisationTable')),
        url: '/registered-organisations',
        requirePermission: true,
        userTypes: [usertypes.superAdmin]
    }, {
        title: 'Invite Organisation',
        component: lazy(() => import('./InviteOrganisation')),
        url: '/invite-organisations',
        requirePermission: true,
        userTypes: [usertypes.superAdmin]
    }, {
        title: 'Edit Organisation',
        component: lazy(() => import('./EditOrganisation')),
        url: '/edit-organisations/:id/:name',
        requirePermission: true,
        userTypes: [usertypes.superAdmin]
    }, {
        title: 'Organisation Users',
        component: lazy(() => import('./TrustUsers')),
        url: '/organisation-users/:id/:name',
        requirePermission: true,
        userTypes: [usertypes.superAdmin]
    }, {
        title: 'Rejected Users',
        component: lazy(() => import('./RejectedOrganisation')),
        url: '/rejected-organisation',
        requirePermission: true,
        userTypes: [usertypes.superAdmin]
    }
];
