import axios, { AxiosError, AxiosResponse } from 'axios';
import { getLocalStorage, setLocalStorage } from '../utils/localstorage';

// get access token from local storage
const userDetails: any = getLocalStorage('userDetails');

// Skip authorization token for endpoints
const skipAuthorization = [
    { path: 'signin' },
    { path: 'ad-signin' },
    { path: 'signup' },
    { path: 'two-step-authentication' },
    { path: 'support' },
    { path: 'get-user-by-id', position: 2 },
    { path: 'get-trust-name-id', position: 2 },
    { path: 'forgot-password' },
    { path: 'resend-otp' },
    { path: 'verify-otp-by-id' },
    { path: 'resend-otp-by-id' },
    { path: 'create-or-change-password' }
];

// Create api instance with base url
const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_API_VERSION}`
});

// Handle Request on api
const requestInterceptor = (request: any) => {
    const paths = request.url.split('/');

    let skipAuth = false;
    for (const i of skipAuthorization) {
        const { path, position } = i;
        if (path === paths[position || 1]) {
            skipAuth = true;
            break;
        }
    }


    if (!skipAuth) {
        const { accessToken, refreshToken } = userDetails;
        request.headers.Authorization = 'Bearer ' + accessToken;
        request.headers['x-refresh'] = refreshToken;
    }

    return request;
};

// Handle Respose on every api
const responseInterceptor = (response: AxiosResponse) => {
    const newAccessToken: string = response.headers['x-access-token'];
    const newTrustName: string = response.headers['x-trust-name'];

    if (newTrustName) {
        localStorage.clear();
        window.location.href = '/login?state=organisation-name-changed';
    }

    if (newAccessToken) {
        setLocalStorage('userDetails', JSON.stringify({
            ...userDetails,
            accessToken: newAccessToken
        }));
    }

    if (response.headers['file-name']) {
        return response;
    }

    return response.data;
};

// Handle Error Response
const ErrorResponseInterceptor = () => (error: AxiosError) => {
    // Check network status
    if (error.message === 'Network Error') {
        console.log('Service down.');
        return;
    }

    if (error.response) {
        const { status, data }: any = error.response;

        if (status === 400 && data.errorCode === 'RoleChanged') {
            localStorage.clear();
            window.location.href = '/login?state=role-changed';
        }

        if (status === 401 && (data.message === 'Invalid Token' || data.message === 'Session Expired')) {
            // Handle if the refresh token also expired and handle session expired
            localStorage.clear();
            window.location.href = '/login?state=session-expired';
        }
    }

    if (error.response) {
        return Promise.reject(error.response.data);
    }
};

// Request Interceptor
instance.interceptors.request.use(requestInterceptor);
// Response Interceptor
instance.interceptors.response.use(responseInterceptor, ErrorResponseInterceptor());

export default instance;
