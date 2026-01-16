import React, { useState } from 'react'
import { CButton, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilCheckCircle, cilX, cilTruck, cilHome, cilLocationPin } from '@coreui/icons'
import Loader from './loader/loader'
import styles from './orderCard.module.scss'
import GenerateInvoiceModal from './GenerateInvoiceModal/GenerateInvoiceModal.js'
import DriverDetailsModal from './DriverDetailsModal.js'
import { useNavigate } from 'react-router-dom'
import ProductModal from './ProductModal.js'
import RouteDetailsModal from './RouteDetailsModal/RouteDetailsModal.js'
import VehicleSelectionModal from './VehicleSelectionModal/VehicleSelectionModal.js' // Import the new modal
import { useTranslation } from 'react-i18next'

const OrderCard = ({ order, loading, onStatusChange, type }) => {
  const {
    orderId,
    customer,
    items = [],
    subTotal,
    shippingFee,
    grandTotal,
    status,
    paymentStatus,
    createdAt,
    dataToken,
    legs,
  } = order

  const [invoiceVisible, setInvoiceVisible] = useState(false)
  const [driverVisible, setDriverVisible] = useState(false)
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [routeModalVisible, setRouteModalVisible] = useState(false)
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false) // New state for vehicle modal
  const navigate = useNavigate()
  const { t } = useTranslation('ordercard')

  const handleApproveClick = () => {
    if (order.type === '2') {
      // For marketplace orders, show vehicle selection modal
      setVehicleModalVisible(true)
    } else {
      // For other order types, approve directly
      onStatusChange(orderId, 'confirmed')
    }
  }

  const handleApproveWithVehicle = (orderId, status, vehicleType) => {
    // Call the onStatusChange function with vehicle type
    onStatusChange(orderId, status, vehicleType)
  }

  const handleChatWithCustomer = () => {
    navigate('/orders/order-chat', {
      state: {
        userOneId: order.vendor?._id,
        userTwoId: order.customer?._id,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        type: 'Customer',
      },
    })
  }

  const handleChatWithDriver = () => {
    navigate('/orders/order-chat', {
      state: {
        userOneId: order.vendor?._id,
        userTwoId: order.driver?.id,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        type: 'Driver',
      },
    })
  }

  const renderStatusActions = () => {
    if (loading) {
      return (
        <div className={styles.loaderContainer}>
          <Loader size={20} />
        </div>
      )
    }

    if (type === 'request') {
      if (status === 'confirmed') {
        return (
          <CButton
            size="sm"
            color="info"
            variant="outline"
            className={styles.chatButton}
            onClick={() => onStatusChange(orderId, 'ready')}
          >
            <CIcon icon={cilCheckCircle} className="me-1" />
            Mark as Ready
          </CButton>
        )
      } else if (status === 'pending') {
        return (
          <div className={styles.approvalActions}>
            <CButton
              size="sm"
              color="success"
              variant="outline"
              className={styles.chatButton}
              onClick={handleApproveClick} // Updated to use new handler
            >
              <CIcon icon={cilCheck} className="me-1" />
              {t('Approve')}
            </CButton>
            <CButton
              size="sm"
              color="danger"
              variant="outline"
              className={styles.chatButton}
              onClick={() => onStatusChange(orderId, 'cancelled')}
            >
              <CIcon icon={cilX} className="me-1" />
              {t('Reject')}
            </CButton>
          </div>
        )
      }
    }

    if (type === 'ready' && status === 'confirmed') {
      return (
        <CButton
          size="sm"
          color="info"
          variant="outline"
          className={styles.chatButton}
          onClick={() => onStatusChange(orderId, 'ready')}
        >
          <CIcon icon={cilCheckCircle} className="me-1" />
          Mark as Ready
        </CButton>
      )
    }

    return null
  }

  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: { class: 'bg-warning text-dark', label: t('Pending') },
      confirmed: { class: 'bg-info text-white', label: t('Confirmed') },
      cancelled: { class: 'bg-danger text-white', label: t('Cancelled') },
      'driver-accepted': { class: 'bg-primary text-white', label: t('Driver Accepted') },
      returned: { class: 'bg-secondary text-white', label: t('Returned') },
      Ready: { class: 'bg-primary text-white', label: t('Ready') },
      ready: { class: 'bg-primary text-white', label: t('Ready') },
      shipped: { class: 'bg-primary text-white', label: t('Shipped') },
      'in-transit': { class: 'bg-primary text-white', label: t('In Transit') },
      delivered: { class: 'bg-success text-white', label: t('Delivered') },
    }

    const { class: badgeClass = 'bg-light text-dark', label = status } = statusMap[status] || {}

    return <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>{label}</span>
  }

  const PaymentBadge = ({ status }) => {
    const paymentMap = {
      paid: 'bg-success text-white',
      unpaid: 'bg-danger text-white',
      pending: 'bg-warning text-dark',
    }

    const badgeClass = `px-2 py-1 rounded text-xs font-semibold ${
      paymentMap[status] || 'bg-light text-dark'
    }`

    return <span className={badgeClass}>{t(status?.charAt(0).toUpperCase() + status?.slice(1))}</span>
  }

  const firstProduct = items[0]

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h4>{order.orderNumber}</h4>
        <p>{new Date(createdAt).toLocaleString()}</p>
      </div>

      <div className={styles.orderBody}>
        {/* Customer Info */}
        <p>
          <strong>{t('Customer')}:</strong> {customer?.email || '—'}
        </p>

        {/* Delivery Route */}
        <div className={styles.locationSection}>
          <div className="px-3 py-2 bg-light border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-2 text-primary">
              <CIcon icon={cilTruck} className="me-2" />
              {t('Delivery Route')}
            </h6>
            <CButton
              size="sm"
              color="primary"
              variant="outline"
              className={styles.chatButton}
              onClick={() => setRouteModalVisible(true)}
            >
              {t('View Route')} ({legs.length} leg{legs.length !== 1 ? 's' : ''})
            </CButton>
          </div>

          <div className="px-3 py-3">
            {/* Pickup Location */}
            <div className="d-flex align-items-start mb-3">
              <div>
                <div className={`${styles.locationIcon} ${styles.pickupIcon}`}>
                  <CIcon icon={cilLocationPin} className="text-white" size="l" />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <strong className="text-primary me-2">{t('Pickup Location')}</strong>
                  <CBadge color="primary" variant="outline" className="text-xs">
                    {t('From')}
                  </CBadge>
                </div>
                <p className="text-muted mb-1 small">
                  <>
                    {order.pickupStreet}, {order.pickupCity}, {order.pickupState},{' '}
                    {order.pickupCountry}
                  </>
                </p>
              </div>
            </div>

            {/* Route Connector */}
            <div className="d-flex align-items-center mb-3 ms-3">
              <div
                className="border-start border-2 border-primary"
                style={{ height: '30px', width: '2px' }}
              ></div>
            </div>

            {/* Drop Location */}
            <div className="d-flex align-items-start">
              <div>
                <div className={`${styles.locationIcon} ${styles.dropIcon}`}>
                  <CIcon icon={cilHome} className="text-white" size="sm" />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <strong className="text-success me-2">{t('Delivery Address')}</strong>
                  <CBadge color="success" variant="outline" className="text-xs">
                    {t('To')}
                  </CBadge>
                </div>
                <p className="text-muted mb-1 small">
                  {order.dropStreet}, {order.dropCity}, {order.dropState}, {order.dropCountry}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-3 py-2 bg-light border-bottom mb-1">
          <h6 className="mb-2 text-primary">📦 {t('Order Details')}</h6>
        </div>
        {/* Inline Product Section */}
        <div className={styles.productSection}>
          {firstProduct && (
            <div className={styles.productDetails}>
              <div className={styles.productInfo}>
                <p>{firstProduct.productId.productName || '—'}</p>
              </div>
              <div className={styles.quantity}>
                <p>{firstProduct.quantity}x</p>
              </div>
            </div>
          )}

          {/* Show More button */}
          {items.length > 1 && (
            <CButton
              size="sm"
              color="secondary"
              variant="outline"
              className="mt-2"
              onClick={() => setProductModalVisible(true)}
            >
              +{items.length - 1} more item{items.length - 1 > 1 ? 's' : ''}
            </CButton>
          )}
        </div>

        {/* Totals */}
        <div className={styles.orderDetails}>
          <div className={styles.detailBlock}>
            {subTotal !== undefined && (
              <p>
                {t('Subtotal')}: {subTotal} SYP
              </p>
            )}
            <span className={styles.detailBadge}>
              {order.type === '1' ? `⚡ ${t('15 min')}` : `🛒 ${t('Marketplace')}`}
            </span>
          </div>

          <div className={styles.detailBlock}>
            {shippingFee !== undefined && (
              <p>
                {t('Shipping Fee')}: {shippingFee} SYP
              </p>
            )}
            <StatusBadge status={order.status} />
          </div>

          <div className={styles.detailBlock}>
            <p>
              {t('Grand Total')}: {grandTotal} SYP
            </p>
            {paymentStatus && <PaymentBadge status={paymentStatus} />}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {renderStatusActions()}

          <CButton
            size="sm"
            color="primary"
            variant="outline"
            className={styles.chatButton}
            onClick={() => setInvoiceVisible(true)}
          >
            {t('View Invoice')}
          </CButton>

          {order.legs[0].driver && (
            <>
              <CButton
                size="sm"
                color="info"
                variant="outline"
                className={styles.chatButton}
                onClick={() => setDriverVisible(true)}
              >
                {t('View Driver')}
              </CButton>
              <CButton
                size="sm"
                color="info"
                variant="outline"
                className={styles.chatButton}
                onClick={handleChatWithDriver}
              >
                {t('Chat with Driver')}
              </CButton>
            </>
          )}

          <CButton
            size="sm"
            color="success"
            variant="outline"
            className={styles.chatButton}
            onClick={handleChatWithCustomer}
          >
            {t('Chat with Customer')}
          </CButton>
        </div>
      </div>

      {/* Modals */}
      <GenerateInvoiceModal visible={invoiceVisible} setVisible={setInvoiceVisible} order={order} />
      <DriverDetailsModal
        visible={driverVisible}
        setVisible={setDriverVisible}
        driver={order.legs[0].driver}
      />
      <ProductModal
        visible={productModalVisible}
        setVisible={setProductModalVisible}
        products={items}
        orderNumber={order.orderNumber}
      />
      <RouteDetailsModal
        visible={routeModalVisible}
        setVisible={setRouteModalVisible}
        legs={legs}
      />

      {/* Vehicle Selection Modal */}
      <VehicleSelectionModal
        visible={vehicleModalVisible}
        setVisible={setVehicleModalVisible}
        order={order}
        onApprove={handleApproveWithVehicle}
      />
    </div>
  )
}

export default OrderCard
