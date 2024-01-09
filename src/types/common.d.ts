interface Pagination {
    limit?: number;
    page?: number;
    searchText?: string;
    fromDate?: Date | null;
    toDate?: Date | null;
}

interface LocalStorageUserDetails {
    accessToken: string;
    email: string;
    id: string;
    name: string;
    refreshToken: string;
    trustId: string | null;
    usertype: string;
    trustName: string;
}

export {
    Pagination,
    LocalStorageUserDetails
};
