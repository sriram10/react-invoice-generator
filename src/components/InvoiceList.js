import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchData from '../utils/fetchData';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import parseDate from 'date-fns/parse';
import {
  rankItem,
} from '@tanstack/match-sorter-utils'


const InvoiceList = ({ clientName }) => {
  const navigate = useNavigate();
  const [list, setList] = useState({
    data: []
  });
  const [pagination, setPagination] = useState({
    page_no: 1,
    per_page: 15,
    total_count: 0,
    total_pages: 0
  });
  const [loading, setLoading] = useState(false);
  
  const [sorting, setSorting] = useState([{ id: 'invoiceDate', desc: true }]);

  // Fetch data with pagination
  const fetchInvoices = async (pageNo = 1, perPage = 15, clientName = '') => {
    setLoading(true);
    try {
      const url = `/getinvoice?page_no=${pageNo}&per_page=${perPage}${clientName ? `&client=${clientName}` : ''}`;
      const response = await fetchData({ url });
      // New format with pagination
      setList({
        data: response.data || []
      });
      setPagination(response.pagination || {
        page_no: 1,
        per_page: 15,
        total_count: 0,
        total_pages: 0
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setList({ data: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(pagination.page_no, pagination.per_page, clientName);
  }, [pagination.page_no, pagination.per_page, clientName]);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
  
    // Store the itemRank info
    addMeta({
      itemRank,
    })
  
    // Return if the item should be filtered in/out
    return itemRank.passed
  }

  const table = useReactTable({
    data: list.data,
    columns: [
      {
        header: 'Title',
        accessorKey: 'invoiceTitle'
      },
      {
        header: 'Date',
        accessorKey: 'invoiceDate',
        cell: (value) => <div style={{ textAlign: 'right' }}>{value.getValue()}</div>,
        sortingFn: (a, b, id) => {
          const dateA = parseDate(a.original[id], 'MMM dd, yyyy', new Date());
          const dateB = parseDate(b.original[id], 'MMM dd, yyyy', new Date());
    
          return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
        },
      },
      {
        header: 'Client',
        accessorKey: 'clientName',
        filterFn: 'fuzzy',
      }
    ],
    state: {
      sorting
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    renderFallbackValue: () => {
      return <div>No data</div>
    },
    // Remove client-side pagination
    manualPagination: true,
    pageCount: pagination.total_pages,
  })

  const onViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`)
  }

  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page_no: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ 
      ...prev, 
      per_page: newPageSize, 
      page_no: 1 // Reset to first page when changing page size
    }));
  };

  if (list?.data?.length === 0) {
    return (
      <h4 style={{ textAlign: "center" }}>
        Loading... Please wait while we fetch the data.
      </h4>
    )
  }

  if (list.data.length === 0 && !loading) {
    return (
      <h4 style={{ textAlign: "center" }}>
        No invoices found.
      </h4>
    )
  }

  // console.log(list, table.getRowModel())

  return (
    <div style={{ flex: 1 }}>
      <table className='table w-100'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th>#</th>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan} style={{ cursor: 'pointer' }}>
                  <div onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} onClick={() => onViewInvoice(row.original.invoiceTitle)} style={{ cursor: 'pointer' }}>
              <td style={{ textAlign: "right" }}>
                {((pagination.per_page * (pagination.page_no - 1)) + i + 1)}
              </td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: 20, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div>
          <select
            value={pagination.per_page}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
          >
            {[10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span style={{ color: "rgb(0,0,0,0.5)", marginLeft: 20, display: 'inline-block' }}>
            <strong>{`Showing Page ${pagination.page_no} of ${pagination.total_pages}`}</strong>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {pagination.page_no > 1 && (
            <button onClick={() => handlePageChange(1)}>&lt;&lt;</button>
          )}
          {pagination.page_no > 1 && (
            <button onClick={() => handlePageChange(pagination.page_no - 1)}>
              {pagination.page_no - 1}
            </button>
          )}
          <button disabled>{pagination.page_no}</button>
          {pagination.page_no < pagination.total_pages && (
            <button onClick={() => handlePageChange(pagination.page_no + 1)}>
              {pagination.page_no + 1}
            </button>
          )}
          {pagination.page_no < pagination.total_pages && (
            <button onClick={() => handlePageChange(pagination.total_pages)}>&gt;&gt;</button>
          )}
          <span style={{ color: "rgb(0,0,0,0.5)" }}>
            {pagination.total_count} Total Records
          </span>
        </div>
      </div>
    </div>
  )
}

export default InvoiceList;