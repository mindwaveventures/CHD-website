import { lazy } from 'react';
import { usertypes } from '../../constants';

export default [{
    title: 'Dashboard',
    component: lazy(() => import('./Dashboard')),
    url: '/dashboard',
    requirePermission: true,
    userTypes: [usertypes.admin, usertypes.clinician]
}, {
    title: 'Histoy Data',
    component: lazy(() => import('./HistoryData')),
    url: '/upload-history-data',
    requirePermission: true,
    userTypes: [usertypes.admin, usertypes.clinician]
}, {
    title: 'Future Data',
    component: lazy(() => import('./FutureData')),
    url: '/upload-future-data',
    requirePermission: true,
    userTypes: [usertypes.admin, usertypes.clinician]
}, {
    title: 'Predictions',
    component: lazy(() => import('./Predictions')),
    url: '/predictions',
    requirePermission: true
}, {
    title: 'Download Prediction',
    component: lazy(() => import('./DownloadPrediction')),
    url: '/download-predictions',
    requirePermission: true,
    userTypes: [usertypes.admin, usertypes.clinician]
}];
