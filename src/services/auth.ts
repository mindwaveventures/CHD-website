import axiosAPI from '../middlewares/axios-interceptor';
import * as RequestType from '../types/services';

const signin = (data: RequestType.Signin) => axiosAPI.post('/signin', data);

const twoFactorAuthentication = (data: RequestType.TwoFactorAuthentication) => axiosAPI.post('/two-step-authentication', data);

const signUpWithNewTrust = (data: RequestType.SignUpWithNewTrust) => axiosAPI.post('/signup/new-trust', data);

const signUpWithExistingTrust = (data: RequestType.SignUpWithExistingTrust) => axiosAPI.post('/signup/existing-trust', data);

const createOrChangePassword = (data: RequestType.CreateOrChangePassword) => axiosAPI.post('/create-or-change-password', data);

const getUsersByTrust = (data: RequestType.GetUsersByTrust) => axiosAPI.post('/users/get-users-by-trust', data);

const manageTrustRequest = (data: RequestType.ManageTrustRequest) => axiosAPI.post('/users/manage-trust-request', data);

const manageUserRequest = (data: RequestType.ManageUserRequest) => axiosAPI.post('/users/manage-user-request', data);

const manageUser = (id: string, data: RequestType.ManageUser) => axiosAPI.put(`/users/manage-users/${id}`, data);

const updateProfile = (data: RequestType.UpdateProfile) => axiosAPI.put('/users/update-profile', data);

const forgotPassword = (email: string) => axiosAPI.put(`/forgot-password/${email}`);

const verifyTwoStepAuthentication = (data: RequestType.VerifyTwoStepAuthentication) => axiosAPI.post('/signup/verify-two-step-authentication', data);

const verifyTrustTwoStepAuthentication = (data: RequestType.VerifyTrustTwoStepVerification) => axiosAPI.post('/signup/verify-trust-two-step-authentication', data);

const resendOTP = (data: RequestType.ResendOTP) => axiosAPI.post('/resend-otp', data);

const getUserById = (id: string, code?: string) => axiosAPI.get(`/users/get-user-by-id/${id}/${code || ''}`);

const setPassword = (data: RequestType.SetPassword) => axiosAPI.post('/signup/set-password', data);

const verifyInvitedAccount = (data: RequestType.VerifyTwoStepAuthenticationSignin) => axiosAPI.post('/signup/verify-invited-account', data);

const resendOTPById = (id: string, type: string) => axiosAPI.post(`/resend-otp-by-id/${id}/${type}`);

const verifyOTPById = (id: string, otp: string) => axiosAPI.post(`/verify-otp-by-id/${id}/${otp}`);

const changeRole = (data: RequestType.ChangeRole) => axiosAPI.put('/users/update-role', data);

const manageTwoFactorAuthentication = (data: RequestType.ManageTwoFactorAuthentication) => axiosAPI.post('/manage-two-step-verification', data);

const adLogin = (accessToken: string) => axiosAPI.post('/ad-signin', { accessToken });

const getTrustNameAndId = (name: string) => axiosAPI.get(`/trust/get-trust-name-id/${name}`);

const getUsernameAndIdByTrustId = (trustId: string) => axiosAPI.get(`/users/get-user-name-id-by-trust-id/${trustId}`);

const organisationCreationRequest = (data: RequestType.SupportCreateOrganisation) => axiosAPI.post('/support/organisation-creation-request', data);

const forgotPasswordResendOTP = (id: string) => axiosAPI.post(`/forgot-password/resend-otp/${id}`);

const logout = () => axiosAPI.delete('/logout');

export {
    twoFactorAuthentication,
    signUpWithExistingTrust,
    signUpWithNewTrust,
    createOrChangePassword,
    getUsersByTrust,
    manageTrustRequest,
    manageUserRequest,
    manageUser,
    updateProfile,
    forgotPassword,
    verifyTwoStepAuthentication,
    verifyTrustTwoStepAuthentication,
    resendOTP,
    getUserById,
    setPassword,
    verifyInvitedAccount,
    signin,
    resendOTPById,
    verifyOTPById,
    changeRole,
    manageTwoFactorAuthentication,
    adLogin,
    getTrustNameAndId,
    getUsernameAndIdByTrustId,
    organisationCreationRequest,
    forgotPasswordResendOTP,
    logout
};
