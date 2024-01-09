import React from 'react';
import DataTable from 'react-data-table-component';
import '../style/components/table.css';
import Loading from './Loader';

interface TableProps {
    btnName?: string;
    columns?: any;
    data?: any;
    paginationTotalRows?: number
    onChangePage?: any;
    progressPending?: boolean;
    onChangeRowsPerPage?: any;
    predictionTable?: boolean;
    hidePagination?: boolean;
}


const Table: React.FC<TableProps> = ({
    columns,
    data,
    paginationTotalRows,
    onChangePage,
    onChangeRowsPerPage,
    progressPending,
    predictionTable,
    hidePagination
}) => {
    const Style = () => {
        return <>
            {predictionTable ? <div className='no-data'>Select an organisation to view</div> :
                <div className='no-data'>There are no records to display</div>}
        </>;
    };

    return (
        <>
            <div className='table-blk'>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination={hidePagination ? false : true}
                    paginationServer
                    onChangePage={onChangePage}
                    paginationTotalRows={paginationTotalRows}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    progressPending={progressPending}
                    progressComponent={<Loading addclass='w-12 h-12' />}
                    responsive
                    noDataComponent={<Style />}
                />
            </div>
        </>
    );
};

export default Table;