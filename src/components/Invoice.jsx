import React, { useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import styles from './invoice.module.scss'
import { QRCodeCanvas } from 'qrcode.react'

// import '@coreui/coreui/dist/css/coreui.min.css'

const GenerateInvoice = ({ invoiceData }) => {
  const receiptRef = useRef(null)

  const handlePrint = () => {
    const receiptElement = receiptRef.current
    if (!receiptElement) return
    // Convert all canvases to images for printing
    document.querySelectorAll('canvas').forEach((canvas) => {
      const img = document.createElement('img')
      img.src = canvas.toDataURL('image/png')
      img.width = canvas.width
      img.height = canvas.height
      canvas.parentNode.replaceChild(img, canvas)
    })

    // Clone receipt content
    const clonedContent = receiptElement.cloneNode(true)
    clonedContent.querySelectorAll('.noPrint').forEach((el) => el.remove())

    // Create and configure iframe
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.style.left = '-9999px'
    iframe.style.top = '0'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) return

    // Create base structure
    const html = document.createElement('html')
    const head = document.createElement('head')
    const body = document.createElement('body')

    // Copy existing stylesheets into the iframe
    // Copy all stylesheets and style tags (including SCSS module output)
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    stylesheets.forEach((styleNode) => {
      head.appendChild(styleNode.cloneNode(true))
    })

    // Optional: Add print-specific inline styles
    const style = document.createElement('style')
    style.textContent = `
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  `
    head.appendChild(style)

    // Append cloned receipt content
    body.appendChild(clonedContent)

    // Build and inject HTML structure
    html.appendChild(head)
    html.appendChild(body)
    iframeDoc.replaceChild(html, iframeDoc.documentElement)

    // Wait for DOM render before printing
    setTimeout(() => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
      setTimeout(() => document.body.removeChild(iframe), 1000)
    }, 500)
  }

  return (
    <div
      id="printable-invoice"
      className={styles.invoiceContainer}
      ref={receiptRef}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <CCard className="shadow-none border-0">
        <CCardHeader className="bg-primary text-white">
          <CRow className=" justify-content-between">
            <CCol>
              <h2 style={{ color: 'white' }}>X Souq</h2>
              <p>Syria</p>
              <p>info.souqx@gmail.com</p>
            </CCol>

            <CCol xs="auto" className="text-end">
              <div
                style={{
                  //   width: '70px',
                  //   height: '70px',
                  //   borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="sidebar-brand-full"
                  height={64} // 32 × 2
                  width={180} // 90 × 2
                />
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <div className="text-center mb-4">
            <h3 className="fw-bold">INVOICE</h3>
          </div>

          <CRow className="mb-4">
            <CCol>
              <strong>Order No:</strong> {invoiceData.orderNumber}
            </CCol>
            <CCol className="text-end">
              <strong>Date:</strong>
              {new Date(invoiceData.createdAt).toLocaleString()}
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol>
              <h6 className="fw-bold">PICKUP FROM</h6>
              <p style={{ margin: 0 }}>{invoiceData.pickupStreet || ''}</p>
              <p style={{ margin: 0 }}>{invoiceData.pickupCity || ''}</p>
              <p style={{ margin: 0 }}>{invoiceData.pickupState || ''}</p>
              <p style={{ margin: 0 }}>{invoiceData.pickupCountry || ''}</p>
            </CCol>
            <CCol>
              <h6 className="fw-bold">DROP TO</h6>
              <p style={{ margin: 0 }}> {invoiceData.dropStreet}</p>
              <p style={{ margin: 0 }}>{invoiceData.dropCity}</p>
              <p style={{ margin: 0 }}>{invoiceData.dropState}</p>
              <p style={{ margin: 0 }}>{invoiceData.dropCountry}</p>
            </CCol>
          </CRow>

          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Products</CTableHeaderCell>
                <CTableHeaderCell className="text-center">QTY</CTableHeaderCell>
                <CTableHeaderCell className="text-end">UNIT PRICE(SYP)</CTableHeaderCell>
                <CTableHeaderCell className="text-end">TOTAL(SYP)</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invoiceData?.items?.map((product, index) => (
                <CTableRow key={index}>
                  <CTableDataCell> {product.productId?.productName || '—'}</CTableDataCell>
                  <CTableDataCell className="text-center">{product.quantity}</CTableDataCell>
                  <CTableDataCell className="text-end">{product.price}</CTableDataCell>
                  <CTableDataCell className="text-end">{product.totalPrice}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <div className="row mt-4">
            {/* Left column — center content */}
            <div className="col-6 d-flex justify-content-center align-items-center">
              <QRCodeCanvas
                value={JSON.stringify(invoiceData.dataToken)} // Encode your invoice data
                size={138} // QR code size in pixels
                bgColor="#ffffff" // Background color
                fgColor="#000000" // Foreground color
                level="L" // Error correction level: L, M, Q, H
              />
            </div>

            {/* Right column — align all text to the right */}
            <div className="col-6 d-flex justify-content-end">
              <div style={{ width: '250px' }}>
                <div className="d-flex justify-content-between">
                  <span>SUBTOTAL(SYP)</span>
                  <span>{invoiceData.subTotal}</span>
                </div>
                <div className="d-flex justify-content-between bg-primary text-white p-2 fw-bold">
                  <span>TOTAL(SYP)</span>
                  <span>{invoiceData.subTotal}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-medium">Payment</span>
                  <span
                    className={`fw-semibold ${
                      invoiceData.paymentStatus?.toLowerCase() === 'paid'
                        ? 'text-success'
                        : invoiceData.paymentStatus?.toLowerCase() === 'unpaid'
                          ? 'text-warning'
                          : 'text-danger'
                    }`}
                  >
                    {invoiceData.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="fw-bold">Remarks:</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#555' }}>
              This is a computer-generated invoice and does not require a signature.
            </p>
          </div>
          <div className="text-center fw-bold mt-4">Thank you for your business!</div>
          <div className="text-center mt-4 d-print-none">
            <CButton color="primary" onClick={handlePrint}>
              Print Invoice
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

// Example usage
const Invoice = ({ order }) => {
  useEffect(() => {
    console.log('Order data:', order)
  }, [order])
  return (
    <div className="p-4">
      <GenerateInvoice invoiceData={order} />
    </div>
  )
}

export default Invoice
