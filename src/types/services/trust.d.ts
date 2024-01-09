import { Pagination } from '../common';

interface getAllTrustByStatus extends Pagination {
    status: string;
}

interface CreateTrustAndAdmin {
    name: string;
    firstName: string;
    lastName?: string;
    email: string;
}

interface EditTrust {
    name?: string;
    id: string;
    status?: string;
    reason?: string;
}

export {
    getAllTrustByStatus,
    CreateTrustAndAdmin,
    EditTrust
};
