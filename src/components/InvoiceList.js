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

const InvoiceList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState({
    data: [],
    clients: []
  });

  const [globalFilter, setGlobalFilter] = React.useState('')
  const [sorting, setSorting] = useState([{ id: 'invoiceDate', desc: true }]);
  
  useEffect(() => {
    fetchData({
      url: '/getinvoice'
    })
      .then(d => {
        setList({
          data: d,
          clients: [
            ...new Set(d.map(i => i.clientName))
          ]
        })
      })
  }, []);

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
      sorting,
      globalFilter
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const onViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`)
  }

  if (list.length === 0) {
    return (
      <h4 style={{ textAlign: "center" }}>
        Loading... Please wait while we fetch the data.
      </h4>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div/>
        <div>
          <select
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            style={{ padding: '5px 10px' }}
          >
            <option value="">All</option>
            {
              list.clients.map(c => (
                <option key={c} value={c}>{c}</option>
              ))
            }
          </select>
        </div>
      </div>
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
              <td style={{ textAlign: "right" }}>{((10 * table.getState().pagination.pageIndex) + i + 1)}</td>
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
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span style={{ color: "rgb(0,0,0,0.5)", marginLeft: 20, display: 'inline-block' }}>
            <strong>{`Showing Page ${table.getState().pagination.pageIndex + 1
              } - ${table.getPageCount()}`}</strong>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {table.getState().pagination.pageIndex != 0 && (
            <button onClick={() => table.setPageIndex(0)}>&lt;&lt;</button>
          )}
          {table.getState().pagination.pageIndex != 0 && (
            <button onClick={() => table.previousPage()}>{table.getState().pagination.pageIndex}</button>
          )}
          {table.getState().pagination.pageIndex >= 0 && (
            <button disabled>{table.getState().pagination.pageIndex + 1}</button>
          )}
          {table.getPageCount() != 0 &&
            table.getPageCount() !=
            table.getState().pagination.pageIndex + 1 && (
              <button onClick={() => table.nextPage()}>{table.getState().pagination.pageIndex + 2}</button>
            )}
          {table.getPageCount() != 0 &&
            table.getPageCount() !=
            table.getState().pagination.pageIndex + 1 && (
              <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>&gt;&gt;</button>
            )}
          <span style={{ color: "rgb(0,0,0,0.5)" }}>
            {list?.data?.length} Records
          </span>
        </div>
      </div>
    </div>
  )
}

export default InvoiceList;