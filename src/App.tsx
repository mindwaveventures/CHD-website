import React, { 
  // lazy, 
  Suspense, 
  useEffect 
} from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import './Style.css';
import { Loading, Layout, Header } from './components';
import { getLocalStorage } from './utils/localstorage';
import routes from './routes';
import { LocalStorageUserDetails } from './types';
import { usertypes } from './constants';

// const PageNotFound = lazy(() => import('./pages/auth/PageNotFound'));

// Function allow only the user is signed in
function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const token = getLocalStorage('userDetails');

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RedirectToDashboard({ children }: { children: JSX.Element }) {
  const token = getLocalStorage('userDetails');

  return token ? <Navigate to={(token && token.usertype === usertypes.superAdmin) ? '/registered-organisations' : '/dashboard'} /> : children;
}

function InitialPage() {
  return <Navigate to="/login" />;
}

function LocationBack() {
  const navigate = useNavigate();

  useEffect(()=> {
    navigate(-1);
  }, []);

  return <></>;
}

function App() {
  const userDetails: LocalStorageUserDetails = getLocalStorage('userDetails');

  return (
    <Suspense fallback={<div className='grid place-items-center h-screen'><Loading /></div>}>
      <Routes>
        <Route path="/" element={<RedirectToDashboard><InitialPage /></RedirectToDashboard>} />
        {routes.reduce((totalValue: any, { url, requirePermission, component: Component, title, userTypes = [] }: any) => {
          if (userTypes.length > 0) {
            if (userDetails && userTypes.indexOf(userDetails.usertype) !== -1) {
              totalValue.push(
                <Route
                  key={url}
                  path={url}
                  element={requirePermission ? <RequireAuth>
                    <Layout>
                      <Component title={title} />
                    </Layout>
                  </RequireAuth> : <RedirectToDashboard>
                    <div className='main-section'>
                      <Header headerAuth={false} />
                      <Component title={title} />
                    </div>
                  </RedirectToDashboard>}
                />
              );
              return totalValue;
            }
            return totalValue;
          }
          totalValue.push(
            <Route
              key={url}
              path={url}
              element={requirePermission ? <RequireAuth>
                <Layout>
                  <Component title={title} />
                </Layout>
              </RequireAuth> : <RedirectToDashboard>
                <div className='main-section'>
                  <Header headerAuth={false} />
                  <Component title={title} />
                </div>
              </RedirectToDashboard>}
            />
          );
          return totalValue;
        }, []).map((item: any) => item)}
        <Route path="/*" element={<LocationBack />} />
      </Routes>
    </Suspense>
  );
}

export default App;
