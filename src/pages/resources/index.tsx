import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [
    {
        title: 'Resources',
        component: lazy(() => import('./Resources')),
        url: '/resources',
        requirePermission: true,
        userTypes: [usertypes.admin, usertypes.clinician, usertypes.superAdmin]
    },
];