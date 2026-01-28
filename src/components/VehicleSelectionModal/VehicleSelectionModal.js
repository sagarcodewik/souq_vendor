import React, { useState } from 'react'
import {CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormCheck,} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilBike } from '@coreui/icons'

const VehicleSelectionModal = ({ visible, setVisible, order, onApprove }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('')

  const handleApprove = () => {
    if (!selectedVehicle) return
    onApprove(order.orderId, 'confirmed', selectedVehicle)
    handleClose()
  }

  const handleClose = () => {
    setVisible(false)
    setSelectedVehicle('')
  }

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" size="md"> 
      <CModalHeader className="justify-content-center border-0">
        <CModalTitle className="fw-bold text-center">
          <CIcon icon={cilTruck} className="me-2 text-success" /> Select Vehicle Type
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p className="text-center text-muted mb-3"> Choose the delivery vehicle for <br /> <strong className="text-dark">{order.orderNumber}</strong></p>
        <div className="row g-3 justify-content-center">
          {[{ key: 'bike', label: 'Bike', icon: cilBike }, { key: 'van', label: 'Van', icon: cilTruck },].map((item) => (
            <div className="col-6" key={item.key}>
              <div className={`card select-card text-center p-4 rounded h-100 ${selectedVehicle === item.key ? 'active' : ''}`} onClick={() => setSelectedVehicle(item.key)} role="button">
                <CFormCheck type="radio" name="vehicleType" value={item.key} checked={selectedVehicle === item.key} onChange={() => setSelectedVehicle(item.key)} className="d-none"/>
                <CIcon icon={item.icon} size="xl" className="mb-2 mx-auto" />
                <h6 className="fw-semibold mb-0">{item.label}</h6>
              </div>
            </div>
          ))}
        </div>
        {!selectedVehicle && (
          <small className="text-center text-muted d-block mt-3">Please select a vehicle to continue</small>
        )}
      </CModalBody>
      <CModalFooter className="justify-content-between px-3">
        <CButton color="secondary" variant="outline" onClick={handleClose} className="m-0">Cancel</CButton>
        <CButton color="success" onClick={handleApprove} disabled={!selectedVehicle} className="m-0 text-white"> Approve with{' '}{selectedVehicle ? selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1) : 'Vehicle'}</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default VehicleSelectionModal
