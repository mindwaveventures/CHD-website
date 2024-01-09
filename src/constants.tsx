const usertypes = {
    clinician: 'Clinician',
    admin: 'Admin',
    superAdmin: 'Super Admin'
};

const userStatus = {
    active: 'Active',
    delete: 'deleted',
    requested: 'Request',
    rejected: 'Rejected'
};

const trustStatus = {
    active: 'Active',
    request: 'Requested',
    rejected: 'Rejected',
    archived: 'Archived'
};

const fileUploadStatus = {
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed'
};

const storageAccountStatus = {
    failed: 'Failed',
    success: 'Created',
    inprogress: 'Inprogress'
};

const otpVerificationType = {
    loginVerification: 'Login-verification',
    accountVerification: 'Account-verification',
    forgotPasswordVerification: 'Forgot-password-verification',
    trustVerification: 'Trust-verification',
    setNewAccountPassword: 'Set-account-password-verification',
};

const getUserType = (usertype: string) => {
    return usertype === usertypes.clinician ? 'User' : usertype;
};

export {
    usertypes,
    userStatus,
    trustStatus,
    getUserType,
    storageAccountStatus,
    fileUploadStatus,
    otpVerificationType
};
