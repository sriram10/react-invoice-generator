import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import InvoicePage from '../components/InvoicePage'
import { initialInvoice } from '../data/initialData';
import fetchData from '../utils/fetchData';
import { GetInvoiceFromId } from '../utils/fetchdataFirebase.jsx';

const currencyList = {
  'INR': { symbol: '₹', code: 'INR', label: 'INR', text: 'Rupees' },
  'AUD': { symbol: '$', code: 'AUD', label: 'AUD', text: 'AUD' },
  'USD': { symbol: '$', code: 'USD', label: 'USD', text: 'USD' },
}

function InvoiceScreen() {
  const { invoiceid } = useParams();
  const [currency, setCurrency] = useState('AUD');
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(initialInvoice)
  const [taxOptions, setTaxOptions] = useState({
    cgst: false,
    sgst: false,
    igst: false,
  });
  const [monthlyTemplate, setMonthlyTemplate] = useState(true);

  // const [igstCheack,setIgstCheacked] = useState(false);

  const onChangeCurrency = (event) => {
    setCurrency(event.target.value)
  }

  const onChangeTaxOption = (type) => () => {
    console.log(type)
    setTaxOptions(opt => ({
      ...opt,
      [type]: !opt[type]
    }))
  }

  useEffect(() => {
    // fetchData({
      // url: `/getinvoice?invoiceTitle=${invoiceid}`
    // })
    console.log("[params🌴]",invoiceid);
    GetInvoiceFromId(invoiceid)
    .then(d => {
      if(Array.isArray(d) && d.length) {
        setInvoiceData(d[0])
        setTaxOptions({
          cgst: d[0].cgst === "" ? false : true,
          sgst: d[0].sgst === "" ? false : true,
          igst: d[0].igst === "" ? false : true,
        })
        setCurrency(`${d[0].currency}`)
      }
    })
    .catch(e => {
      console.log(e)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [invoiceid])

  if (loading) {
    return (
      <div>
        <Header />
        <div className="app">
          <h1 className='center'>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="app">
        <div className='flex mb-5'>
          <section>
            <select value={currency} onChange={onChangeCurrency}>
              <option value={"INR"}>₹ - Rupee</option>
              <option value={"USD"}>$ - USD</option>
              <option value={"AUD"}>$ - AUD</option>
            </select> 
          </section>
          <section className='pl-5 flex'>
            <div className='pl-5'>
              <input type="checkbox" defaultChecked={taxOptions.igst} value={taxOptions.igst} onChange={onChangeTaxOption('igst')} id="show-igst" />
              <label htmlFor="show-igst">IGST</label>
            </div>
            <div className='pl-5'>
              <input type="checkbox" defaultChecked={taxOptions.cgst } value={taxOptions.cgst} onChange={onChangeTaxOption('cgst')} id="show-cgst" />
              <label htmlFor="show-cgst">CGST</label>
            </div>
            <div className='pl-5'>
              <input type="checkbox" defaultChecked={taxOptions.sgst} value={taxOptions.sgst} onChange={onChangeTaxOption('sgst')} id="show-sgst" />
              <label htmlFor="show-sgst">SGST</label>
            </div>
          </section>
          {/* <section className='pl-5'>
            <div>
              <input type="checkbox" value={monthlyTemplate} onChange={() => setMonthlyTemplate(v => !v)} id="monthly-template" />
              <label htmlFor="monthly-template">Template without Hours</label>
            </div>
          </section> */}
        </div>
        <div>
          <InvoicePage
            taxOptions={taxOptions}
            currency={currencyList[currency]}
            // monthlyTemplate={monthlyTemplate}
            data={{ ...invoiceData }}
            btnKey={"update"}
            id = {`${invoiceid}`}
            />
        </div>
      </div>
    </div>
  )
}

export default InvoiceScreen