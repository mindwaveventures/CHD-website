import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [
    {
        title: 'Audit Logs',
        component: lazy(() => import('./AuditLogList')),
        url: '/audit-logs',
        requirePermission: true,
        userTypes: [usertypes.admin, usertypes.superAdmin]
    }
];
