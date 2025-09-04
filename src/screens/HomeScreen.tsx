import React, { useState } from 'react'
import Header from '../components/header/Header'
import InvoiceList from '../components/InvoiceList'
import ClientsList from '../components/ClientsList'

function HomeScreen() {
  const [clientName, setClientName] = useState('');

  return (
    <div>
      <Header />
      <div className='main-app'>
        <div>
          <h2>Invoices</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, flexDirection: 'row', alignItems: 'flex-start' }}>
          <ClientsList clientName={clientName} onChange={setClientName} />
          <InvoiceList key={clientName} clientName={clientName} />
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
