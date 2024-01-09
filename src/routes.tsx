import authModules from './pages/auth';
import dashboardModules from './pages/dashboard';
import userModules from './pages/user';
import organisationModules from './pages/organisation';
import forgotPasswordModules from './pages/forgotpassword';
import settingsModules from './pages/settings';
import auditLogModules from './pages/auditlogs';
import resourceModules from './pages/resources';

export default [
    ...authModules,
    ...dashboardModules,
    ...userModules,
    ...organisationModules,
    ...forgotPasswordModules,
    ...settingsModules,
    ...auditLogModules,
    ...resourceModules
];
