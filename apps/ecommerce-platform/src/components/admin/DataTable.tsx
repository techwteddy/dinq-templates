'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T;
    searchPlaceholder?: string;
    filters?: {
        label: string;
        options: string[];
        onFilter: (value: string) => void;
    }[];
    loading?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchKey,
    searchPlaceholder = 'SEARCH SCANNER...',
    filters,
    loading
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((item) => {
        if (!searchTerm || !searchKey) return true;
        const value = item[searchKey];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-white border-2 border-ink rounded-[2rem] shadow-hard overflow-hidden">
            {/* Controls */}
            {(searchKey || filters) && (
                <div className="p-6 border-b-2 border-ink bg-stone/5 flex flex-col sm:flex-row gap-4">
                    {searchKey && (
                        <div className="relative flex-1 group">
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-3 pl-10 font-sans font-bold outline-none shadow-hard-sm focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                        </div>
                    )}
                    {filters?.map((filter, i) => (
                        <div key={i} className="relative min-w-[150px]">
                            <select
                                onChange={(e) => filter.onFilter(e.target.value)}
                                className="w-full appearance-none bg-paper border-2 border-ink rounded-xl px-4 py-3 pr-10 font-sans font-bold outline-none shadow-hard-sm cursor-pointer"
                            >
                                <option value="">{filter.label}</option>
                                {filter.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-40" />
                        </div>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto no-scrollbar">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <p className="font-display text-3xl uppercase italic opacity-20">Scanning Registry...</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone/20 border-b-2 border-ink">
                                {columns.map((col, i) => (
                                    <th
                                        key={i}
                                        className={`p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ${col.className}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-ink/5">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="group hover:bg-stone/5 transition-colors">
                                    {columns.map((col, i) => (
                                        <td key={i} className={`p-6 ${col.className}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-20 text-center text-[10px] font-bold opacity-20 uppercase tracking-widest italic"
                                    >
                                        Zero results detected in this sector
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
