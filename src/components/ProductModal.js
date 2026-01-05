import React from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilX } from '@coreui/icons'

const ProductModal = ({ visible, setVisible, products, orderNumber }) => {
  return (
    <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>All Products - Order {orderNumber}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="row g-3">
          {products?.map((product, index) => (
            <div key={index} className="col-12">
              <div className="card border-light shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1 me-3">
                      <h6 className="card-title mb-2 text-dark fw-semibold">
                        {product.productId.productName || '—'}
                      </h6>
                      {product.productId.description && (
                        <p className="card-text text-muted small mb-2">
                          {product.productId.description}
                        </p>
                      )}
                      {product.productId.price && (
                        <div className="d-flex align-items-center">
                          <span className="badge bg-success-subtle text-success me-2">
                            Price: {product.productId.price} SYP
                          </span>
                          {product.productId.price && (
                            <small className="text-muted">
                              <strong>
                                Total: {product.productId.price * product.quantity} SYP
                              </strong>
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-center flex-shrink-0">
                      <div
                        className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle fw-bold"
                        style={{ width: '3rem', height: '3rem' }}
                      >
                        {product.quantity}x
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(!products || products.length === 0) && (
          <div className="text-center py-4">
            <p className="text-muted mb-0">No products found for this order.</p>
          </div>
        )}
      </CModalBody>
      <CModalFooter className="border-top">
        <CButton
          color="secondary"
          variant="outline"
          onClick={() => setVisible(false)}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilX} className="me-2" />
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ProductModal
