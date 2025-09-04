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

function toTitleCase(str) {
  if (!str) return '';
  // Convert the entire string to lowercase to handle varying initial capitalization
  let words = str.toLowerCase().split(' ');

  // Define a list of "minor" words that should generally remain lowercase
  const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'of', 'in', 'with'];

  // Iterate through each word and apply title case logic
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Capitalize the first letter of the word if it's not a minor word (and not the first word)
    if (i === 0 || !minorWords.includes(word)) {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
  }

  // Join the words back into a single string
  return words.join(' ');
}

const ClientsList = ({ clientName, onChange }) => {
  const [searchText, setSearchText] = useState('');
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  // Fetch clients from /clients API
  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const response = await fetchData({ url: '/clients' });
      const result = response.map(client => {
        return {
          label: toTitleCase(client.replace(/-/g, ' ')),
          value: client
        }
      });
      setClients(result || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientFilterChange = (clientName) => {
    onChange(clientName);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <input type="text" className='search-input' placeholder="Search clients" value={searchText} onChange={e => setSearchText(e.target.value)} />
          <button onClick={() => setSearchText('')} className='btn-clear'>Clear</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh', overflowY: 'auto' }}>
          {clientsLoading && (
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
              Loading clients...
            </span>
          )}
          {clients?.filter(c => c.label.toLowerCase().includes(searchText.toLowerCase()))?.map(c => (
            <label className='client-label' key={c.value}>
              <input type="radio" name="clientName" checked={clientName === c.value} value={c.value} onChange={e => handleClientFilterChange(e.target.value)} />
              {c.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClientsList;