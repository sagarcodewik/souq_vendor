import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'
import styles from './driverDetailsModal.module.scss'

const DriverDetailsModal = ({ visible, setVisible, driver }) => {
  if (!driver) return null

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      alignment="center"
      className={styles.driverModal}
    >
      <CModalHeader className={styles.modalHeader} closeButton>
        Driver Details
      </CModalHeader>
      <CModalBody className={styles.modalBody}>
        <img
          src={driver.profileImage || '/default-driver.png'}
          alt="Driver"
          className={styles.profileImage}
        />
        <h5>{driver.fullName}</h5>
        <p>
          <strong>📱 Mobile:</strong> {driver.mobileNumber}
        </p>
        <p>
          <strong>Status:</strong> {driver.status}
        </p>
        <p>
          <strong>Available:</strong> {driver.isAvailable ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Delivering:</strong> {driver.isDelivering ? 'Yes' : 'No'}
        </p>
      </CModalBody>
      <CModalFooter className={styles.modalFooter}>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DriverDetailsModal
