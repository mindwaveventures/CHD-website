import { Pagination } from '../common';

interface GetAuditLogAdmin extends Pagination {
    organisationId: string;
    fromDate: Date | null;
    toDate: Date | null;
}

export {
    GetAuditLogAdmin
};
