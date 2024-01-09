import { lazy } from 'react';

export default [{
    title: 'Login Account',
    component: lazy(() => import('./Login')),
    url: '/login',
    requirePermission: false,
}, {
    title: 'Register Account',
    component: lazy(() => import('./Signup')),
    url: '/sign-up',
    requirePermission: false,
}, {
    title: 'Support',
    component: lazy(() => import('./Support')),
    url: '/support',
    requirePermission: false
}, {
    title: 'Set Password',
    component: lazy(() => import('./SetPassowrd')),
    url: '/setup-account/:code/:id',
    requirePermission: false
}, {
    title: 'Two Factor Authentication',
    component: lazy(() => import('./TwoFactorAuthentication')),
    url: '/two-factor-authentication/:id',
    requirePermission: false
}];
