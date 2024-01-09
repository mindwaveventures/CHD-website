import { Pagination } from '../common';

interface Signin {
    id: string;
    otp: string;
}

interface TwoFactorAuthentication {
    email: string;
    password: string;
}

interface SignUpWithNewTrust {
    email: string;
    otp: string;
    name: string;
    firstName: string;
    lastName?: string;
    newPassword: string;
    confirmPassword: string;
}

interface SignUpWithExistingTrust {
    otp: string;
    email: string;
    trustId: string;
    firstName: string;
    lastName?: string;
    newPassword: string;
    confirmPassword: string;
    OTPType?: string;
}

interface CreateOrChangePassword {
    id: string;
    newPassword: string;
    confirmPassword: string;
}

interface GetUsersByTrust extends Pagination {
    trustId: string;
    status?: string;
}

interface ManageTrustRequest {
    trustId: string;
    status: string;
    reason?: string;
}

interface ManageUserRequest {
    userid: string;
    status: string;
    reason?: string;
}

interface ManageUser {
    status: string;
}

interface UpdateProfile {
    firstName: string;
    lastName: string;
    email?: string;
    mobileNo: string;
}

interface VerifyTwoStepAuthentication {
    emailAuth: boolean;
    smsAuth: boolean;
    email: string;
    phone?: string;
    trustId: string;
    firstName: string;
    lastName?: string;
    newPassword: string;
    confirmPassword: string;
}

interface VerifyTrustTwoStepVerification {
    name: string;
    firstName: string;
    lastName?: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
    authSMS: boolean;
    authEmail: boolean;
    phone: string;
}

interface ResendOTP {
    email: string;
    authEmail: boolean;
    authSMS: boolean;
    OTPType?: string;
}

interface ChangeRole {
    id: string;
    usertype: string;
    name: string;
}

interface SetPassword {
    id: string;
    newPassword: string;
    confirmPassword: string;
    mobileNo?: string;
    authEmail: boolean;
    authSMS: boolean;
}

interface VerifyTwoStepAuthenticationSignin {
    id: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

interface ManageTwoFactorAuthentication {
    email: string;
    mobileNo: string;
    authEmail: boolean;
    authSMS: boolean;
    otp: string;
}

interface SupportCreateOrganisation {
    name: string;
    email: string;
    comments: string;
}

export {
    TwoFactorAuthentication,
    SignUpWithNewTrust,
    SignUpWithExistingTrust,
    CreateOrChangePassword,
    GetUsersByTrust,
    ManageTrustRequest,
    ManageUserRequest,
    ManageUser,
    UpdateProfile,
    VerifyTwoStepAuthentication,
    VerifyTrustTwoStepVerification,
    ResendOTP,
    SetPassword,
    VerifyTwoStepAuthenticationSignin,
    Signin,
    ChangeRole,
    ManageTwoFactorAuthentication,
    SupportCreateOrganisation
};
