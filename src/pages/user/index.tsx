import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [{
    title: 'User',
    component: lazy(() => import('./UserTable')),
    url: '/users',
    requirePermission: true,
    userTypes: [usertypes.admin]
}];
