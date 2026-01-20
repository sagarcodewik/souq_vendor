import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTruck, cilBike } from '@coreui/icons'

const VehicleSelectionModal = ({ visible, setVisible, order, onApprove }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('')

 const handleApprove = () => {
  if (!selectedVehicle) return

  onApprove(order._id, 'confirmed', selectedVehicle)
  setVisible(false)
  setSelectedVehicle('')
}

  const handleClose = () => {
    setVisible(false)
    setSelectedVehicle('') // Reset selection on close
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="md">
      <CModalHeader>
        <CModalTitle>
          <CIcon icon={cilTruck} className="me-2" />
          Select Vehicle Type
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="text-center mb-3">
          <p className="mb-3">
            Please choose the vehicle type for order <strong>{order.orderNumber}</strong>
          </p>

          <div className="row g-3">
            <div className="col-6">
              <CFormCheck
                type="radio"
                name="vehicleType"
                id="bike"
                value="bike"
                checked={selectedVehicle === 'bike'}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                label={
                  <div className="text-center">
                    <CIcon icon={cilBike} size="xl" className="mb-2 d-block mx-auto" />
                    <span>Bike</span>
                  </div>
                }
                className="vehicle-option p-3 border rounded h-100"
              />
            </div>
            <div className="col-6">
              <CFormCheck
                type="radio"
                name="vehicleType"
                id="van"
                value="van"
                checked={selectedVehicle === 'van'}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                label={
                  <div className="text-center">
                    <CIcon icon={cilTruck} size="xl" className="mb-2 d-block mx-auto" />
                    <span>Van</span>
                  </div>
                }
                className="vehicle-option p-3 border rounded h-100"
              />
            </div>
          </div>

          {!selectedVehicle && (
            <small className="text-muted mt-2 d-block">
              Please select a vehicle type to proceed
            </small>
          )}
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="success" onClick={handleApprove} disabled={!selectedVehicle}>
          Approve with{' '}
          {selectedVehicle
            ? selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)
            : 'Vehicle'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default VehicleSelectionModal
