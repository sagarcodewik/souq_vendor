import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const ConfirmationModal = ({
  visible,
  title = 'Are you sure?',
  body = 'Do you really want to perform this action?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <CModal visible={visible} onClose={onCancel}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{body}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel} disabled={loading}>
          {cancelText}
        </CButton>
        <CButton color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing...' : confirmText}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmationModal
