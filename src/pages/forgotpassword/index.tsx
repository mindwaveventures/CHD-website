import { lazy } from 'react';

export default [
    {
        title: 'Forgot Password',
        component: lazy(() => import('./ForgotPassword')),
        url: '/forgot-password/email',
        requirePermission: false,
    },
    {
        title: 'Forgot Password',
        component: lazy(() => import('./VerifyOTP')),
        url: '/forgot-password/verify-otp',
        requirePermission: false,
    },
    {
        title: 'Forgot Password',
        component: lazy(() => import('./SetPassword')),
        url: '/forgot-password/set-password',
        requirePermission: false,
    },
    {
        title: 'Forgot Password',
        component: lazy(() => import('./Confirmation')),
        url: '/forgot-password/password-reset-successfully',
        requirePermission: false,
    },
];