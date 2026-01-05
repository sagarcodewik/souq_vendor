// GenerateInvoiceModal.js
import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalTitle } from '@coreui/react'
import Invoice from '../Invoice'

const GenerateInvoiceModal = ({ visible, setVisible, order }) => {
  return (
    <CModal size="lg" visible={visible} onClose={() => setVisible(false)} scrollable>
      <CModalHeader>
        <CModalTitle>Invoice</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <Invoice order={order} />
      </CModalBody>
    </CModal>
  )
}

export default GenerateInvoiceModal
