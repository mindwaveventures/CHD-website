import axiosAPI from '../middlewares/axios-interceptor';
import RequestType from '../types/services';

const getAllTrustByStatus = (data: RequestType.getAllTrustByStatus) => axiosAPI.post('/trust/get-trust-by-status', data);

const createTrustOrAdmin = (data: RequestType.CreateTrustAndAdmin) => axiosAPI.post('/trust', data);

const editTrust = (data: RequestType.EditTrust) => axiosAPI.put('/trust', data);

const getAllTrustNameAndId = (name = '') => axiosAPI.get(`/trust/get-trust-name-id/${name}`);

const retryStroageAccountCreation = (id: string) => axiosAPI.post(`/trust/retry-storage-account/${id}`);

export {
    getAllTrustByStatus,
    createTrustOrAdmin,
    editTrust,
    getAllTrustNameAndId,
    retryStroageAccountCreation
};
