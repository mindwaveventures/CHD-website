import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [
    {
        title: 'Profile',
        component: lazy(() => import('./ProfileDetail')),
        url: '/profile',
        requirePermission: true
    }, {
        title: 'Account',
        component: lazy(() => import('./AccountDetails')),
        url: '/account',
        requirePermission: true,
        userTypes: [usertypes.admin, usertypes.clinician]
    }
];
