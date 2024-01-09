import axiosAPI from '../middlewares/axios-interceptor';
import * as RequestType from '../types';
import { GetAuditLogAdmin } from '../types/services';

const getAuditLogs = (data: RequestType.Pagination) => axiosAPI.post('/audit-log', data);

const getAllAuditLogForAdmin = (data: GetAuditLogAdmin) => axiosAPI.post('/get-all-audit-log', data);

export {
    getAuditLogs,
    getAllAuditLogForAdmin
};
