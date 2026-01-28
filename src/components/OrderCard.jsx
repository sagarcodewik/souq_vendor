import React, { useState } from 'react'
import {CButton, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CFormTextarea, CModalFooter,} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilCheck, cilCheckCircle, cilX, cilTruck, cilHome, cilLocationPin,} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Loader from './loader/loader'
import GenerateInvoiceModal from './GenerateInvoiceModal/GenerateInvoiceModal'
import DriverDetailsModal from './DriverDetailsModal'
import ProductModal from './ProductModal'
import RouteDetailsModal from './RouteDetailsModal/RouteDetailsModal'
import VehicleSelectionModal from './VehicleSelectionModal/VehicleSelectionModal'
import { CheckCircle, CreditCard, FileText, MessageCircle, ShoppingCart, Truck, User, Wallet, XCircle, Zap } from 'lucide-react'

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
    legs = [],
  } = order

  const navigate = useNavigate()
  const { t } = useTranslation('ordercard')

  /* -------------------- Modals State -------------------- */
  const [invoiceVisible, setInvoiceVisible] = useState(false)
  const [driverVisible, setDriverVisible] = useState(false)
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [routeModalVisible, setRouteModalVisible] = useState(false)
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)

  /* -------------------- Reject Logic -------------------- */
  const [rejectReason, setRejectReason] = useState('')

  const handleRejectOrder = () => {
    onStatusChange(orderId, 'cancelled', rejectReason)
    setRejectReason('')
    setRejectModalVisible(false)
  }

  /* -------------------- Approve Logic -------------------- */
  const handleApproveClick = () => {
    if (order.type === '2') {
      setVehicleModalVisible(true)
    } else {
      onStatusChange(orderId, 'confirmed')
    }
  }

  const handleApproveWithVehicle = (orderId, status, vehicleType) => {
    onStatusChange(orderId, status, vehicleType)
  }

  /* -------------------- Chat Navigation -------------------- */
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
        userTwoId: order.legs?.[0]?.driver?.id,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        type: 'Driver',
      },
    })
  }

  /* -------------------- Status Actions -------------------- */
  const renderStatusActions = () => {
    if (loading) {
      return (
        <div className="loaderContainer">
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
            className="chatButton"
            onClick={() => onStatusChange(orderId, 'ready')}
          >
            <CIcon icon={cilCheckCircle} className="me-1" />
            {t('Mark as Ready')}
          </CButton>
        )
      }

      if (status === 'pending') {
        return (
          <>
            <CButton size="sm" color="success" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={handleApproveClick}> <CheckCircle size={16} /> {t('Approve')}</CButton>
            <CButton size="sm" color="danger" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={() => setRejectModalVisible(true)}> <XCircle size={16} /> {t('Reject')}</CButton>
          </>
        )
      }
    }

    return null
  }

  /* -------------------- Badges -------------------- */
  const StatusBadge = ({ status }) => {
    const statusMap = {
      pending: 'bg-warning text-dark',
      confirmed: 'bg-info text-white',
      cancelled: 'bg-danger text-white',
      ready: 'bg-primary text-white',
      shipped: 'bg-primary text-white',
      'in-transit': 'bg-primary text-white',
      delivered: 'bg-success text-white',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusMap[status] || 'bg-light text-dark'}`}>
        {t(status)}
      </span>
    )
  }

  const PaymentBadge = ({ status }) => {
    const paymentMap = {
      paid: 'bg-success text-white',
      unpaid: 'bg-danger text-white',
      pending: 'bg-warning text-dark',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${paymentMap[status] || 'bg-light text-dark'}`}>
        {t(status)}
      </span>
    )
  }

  const firstProduct = items[0]

  return (
    <>
      <div className="orderCard">
        <div className="orderHeader">
          <h4>{order.orderNumber}</h4>
          <p>{new Date(createdAt).toLocaleString()}</p>
        </div>
        <div className="orderBody">
          <p><strong>{t('Customer')}:</strong> {customer?.email || '—'}</p>
          <div className="locationSection mb-3">
            <div className="sectionHeader d-flex justify-content-between align-items-center">
              <h6>
                <CIcon icon={cilTruck} />
                {t('Delivery Route')}
              </h6>

              <CButton
                size="sm"
                color="primary"
                variant="outline"
                className="chatButton"
                onClick={() => setRouteModalVisible(true)}
              >
                {t('View Route')} ({legs.length} leg{legs.length !== 1 ? 's' : ''})
              </CButton>
            </div>
            <div className="p-3 ">
              <div className="d-flex align-items-start mb-0">
                <div className="locationIcon pickupIcon">
                  <CIcon icon={cilLocationPin} className="text-white" size="l" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <strong className="text-primary me-2">{t('Pickup Location')}</strong>
                    <CBadge color="primary" variant="outline" className="text-xs">{t('From')}</CBadge>
                  </div>
                  <p className="text-muted mb-1 small">{order.pickupStreet}, {order.pickupCity}, {order.pickupState},{' '} {order.pickupCountry}</p>
                </div>
              </div>
              {/* Connector */}
              <div className="routeConnector" />
              {/* Drop */}
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 locationIcon dropIcon"><CIcon icon={cilHome} className="text-white" size="sm" /></div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <strong className="text-success me-2">{t('Delivery Address')}</strong>
                    <CBadge color="success" variant="outline" className="text-xs">{t('To')}</CBadge>
                  </div>
                  <p className="text-muted mb-1 small">{order.dropStreet}, {order.dropCity}, {order.dropState},{' '} {order.dropCountry}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Order Details */}
          <div className="px-3 py-2 bg-light border-bottom mb-3 rounded-3">
            <h6 className="mb-0 text-primary">📦 {t('Order Details')}</h6>
          </div>
          {/* Product Section */}
          <div className="productSection mb-3">
            {firstProduct && (
              <div className="productDetails mb-0">
                <div className="productInfo">
                  <p>{firstProduct.productId?.productName || '—'}</p>
                </div>
                <div className="quantity">
                  <p>{firstProduct.quantity}x</p>
                </div>
              </div>
            )}

            {items.length > 1 && (
              <CButton size="sm" color="secondary" variant="outline" className="mt-2" onClick={() => setProductModalVisible(true)}>+{items.length - 1} more item{items.length - 1 > 1 ? 's' : ''}</CButton>
            )}
          </div>

          {/* Totals */}
          <div className="orderDetails mb-3">
            <div className="detailBlock d-flex justify-content-between align-items-center">
              {subTotal !== undefined && (
                <p className="mb-0 d-flex align-items-center gap-1"><Wallet size={16} /> {t('Subtotal')}: {subTotal} SYP</p>
              )}

              <span className="detailBadge d-flex align-items-center gap-1">
                {order.type === '1' ? (
                  <> <Zap size={14} /> {t('15 min')}
                  </>
                ) : (
                  <> <ShoppingCart size={14} /> {t('Marketplace')}
                  </>
                )}
              </span>
            </div>
            <div className="detailBlock d-flex justify-content-between align-items-center">
              {shippingFee !== undefined && (
                <p className="mb-0 d-flex align-items-center gap-1"> <Truck size={16} /> {t('Shipping Fee')}: {shippingFee} SYP</p>
              )}
              <StatusBadge status={order.status} />
            </div>
            <div className="detailBlock d-flex justify-content-between align-items-center">
              <p className="mb-0 d-flex align-items-center gap-1 fw-semibold"> <CreditCard size={16} /> {t('Grand Total')}: {grandTotal} SYP</p>
              {paymentStatus && <PaymentBadge status={paymentStatus} />}
            </div>
          </div>
          {/* Actions */}
          <div className="actions d-flex flex-wrap gap-2">
            {renderStatusActions()}
            {/* Invoice */}
            <CButton size="sm" color="primary" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={() => setInvoiceVisible(true)}> <FileText size={16} /> {t('View Invoice')}</CButton>
            {/* Driver Actions */}
            {order.legs?.[0]?.driver && (
              <>
                <CButton size="sm" color="info" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={() => setDriverVisible(true)}> <User size={16} /> {t('View Driver')}</CButton>
                <CButton size="sm" color="info" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={handleChatWithDriver}><Truck size={16} /> {t('Chat with Driver')}</CButton>
              </>
            )}
            {/* Customer Chat */}
            <CButton size="sm" color="success" variant="outline" className="chatButton d-flex align-items-center gap-1" onClick={handleChatWithCustomer}> <MessageCircle size={16} /> {t('Chat with Customer')}</CButton>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <CModal visible={rejectModalVisible} onClose={() => setRejectModalVisible(false)} alignment="center">
        <CModalHeader><CModalTitle>{t('Reject Order')}</CModalTitle></CModalHeader>
        <CModalBody>
          <CFormTextarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={t('Enter reason...')}/>
        </CModalBody>
        <CModalFooter className="justify-content-between px-3">
          <CButton color="secondary" onClick={() => setRejectModalVisible(false)} className="m-0">{t('Cancel')}</CButton>
          <CButton color="danger" disabled={!rejectReason.trim()} onClick={handleRejectOrder} className="m-0 text-white">{t('Confirm Reject')}</CButton>
        </CModalFooter>
      </CModal>
      {/* Other Modals */}
      <GenerateInvoiceModal visible={invoiceVisible} setVisible={setInvoiceVisible} order={order} />
      <DriverDetailsModal visible={driverVisible} setVisible={setDriverVisible} driver={order.legs?.[0]?.driver} />
      <ProductModal visible={productModalVisible} setVisible={setProductModalVisible} products={items} />
      <RouteDetailsModal visible={routeModalVisible} setVisible={setRouteModalVisible} legs={legs} />
      <VehicleSelectionModal visible={vehicleModalVisible} setVisible={setVehicleModalVisible} order={order} onApprove={handleApproveWithVehicle}/>
    </>
  )
}

export default OrderCard;
