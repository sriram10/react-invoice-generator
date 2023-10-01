import React, { FC, useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Invoice } from '../data/types'
import InvoicePage from './InvoicePage'

interface Props {
  data: Invoice,
  taxOptions: any,
  currency: any,
}


const Download: FC<Props> = ({ data, taxOptions, currency }) => {
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    setShow(false)

    const timeout = setTimeout(() => {
      setShow(true)
    }, 500)

    return () => clearTimeout(timeout)
  }, [data])

  const printPage = () => {
    window?.print();
  }

  return (
    <div className={'download-pdf ' + (!show ? 'loading' : '')} title="Save PDF">
      {show && (
        // <a onClick={() => printPage()} />
        <PDFDownloadLink
          document={<InvoicePage pdfMode={true} data={data} taxOptions={taxOptions} currency={currency} />}
          fileName={`${data.invoiceTitle ? data.invoiceTitle.toLowerCase() : 'invoice'}.pdf`}
          aria-label="Save PDF"
        ></PDFDownloadLink>
      )}
    </div>
  )
}

export default Download
