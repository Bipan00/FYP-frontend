import React from 'react';

export interface TableColumn {
    header: string;
    key: string;
    
    render?: (value: any, row: any) => React.ReactNode;
}

interface DashboardTableProps {
    columns: TableColumn[];
    rows: any[];
    emptyMessage?: string;
}

const DashboardTable: React.FC<DashboardTableProps> = ({
    columns,
    rows,
    emptyMessage = 'No records found.',
}) => {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-center py-8 text-gray-400 text-sm"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, rowIndex) => (
                            <tr
                                key={row._id || rowIndex}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3">
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key] ?? ''}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTable;
