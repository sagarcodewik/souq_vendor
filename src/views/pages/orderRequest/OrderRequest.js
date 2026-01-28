import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorOrders, updateOrderStatus } from '../../../redux/slice/order'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { CNav, CNavItem, CNavLink, CPagination, CPaginationItem } from '@coreui/react'
import Loader from '../../../components/loader/loader'
import styles from './orderRequest.module.scss'
import OrderCard from '../../../components/OrderCard'
import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'

const TABS = {
  INTRACITY: { key: 'intracity', labelKey: 'intracity', type: '1' },
  INTERCITY: { key: 'intercity', labelKey: 'market_place', type: '2' },
}

const OrderRequest = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('orderrequest')

  const { orders, status, error, currentPage, pageSize, totalRecords, sortKey, sortDirection } =
    useSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState(TABS.INTRACITY)
  const [loadingOrderId, setLoadingOrderId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const fetchOrders = useCallback(
    (page = currentPage, sortK = sortKey, sortD = sortDirection, search = debouncedSearch) => {
      dispatch(
        fetchVendorOrders({
          status: ['pending', 'confirmed'],
          type: activeTab.type,
          page,
          pageSize,
          sortKey: sortK,
          sortDirection: sortD,
          search,
        }),
      )
    },
    [dispatch, activeTab.type, currentPage, pageSize, sortKey, sortDirection, debouncedSearch],
  )

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoadingOrderId(orderId)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const decoded = jwtDecode(token)
      const vendorId = decoded?.id
      if (!vendorId) toast.error('Invalid vendor ID')

      await dispatch(updateOrderStatus({ orderId, status: newStatus, vendorId })).unwrap()
      fetchOrders()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingOrderId(null)
    }
  }

  return (
    <div className="orderRequest">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <h4 className={styles.heading}>{t('pending_order_requests')}</h4>
        <div className={styles.searchWrapper}>
          <input type="text" placeholder={t('search_by_order_number')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control"/>
        </div>
      </div>
      {/* Tabs */}
      <CNav variant="tabs" className={styles.tabContainer}>
        {Object.values(TABS).map((tab) => (
          <CNavItem key={tab.key} className={styles.tabItem}>
            <CNavLink active={activeTab.key === tab.key} onClick={() => setActiveTab(tab)} role="button" className={`${styles.tabLink} ${activeTab.key === tab.key ? styles.activeTab : '' }`}>
              <span className={styles.tabIcon}>{tab.key === 'intracity' ? '🏍️' : '🚌'}</span> {t(tab.labelKey)}
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>
      {error && <p className="text-danger">{error}</p>}
      {status === 'loading' ? (
        <Loader />
      ) : (
        <div className="mt-4">
          {orders.length === 0 ? (
            <p className="text-center text-muted">{t('no_orders_found')}</p>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} loading={loadingOrderId === order._id} onStatusChange={handleStatusChange} type="request"/>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Pagination */}
      {orders.length > 0 && Math.ceil(totalRecords / pageSize) > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <CPagination>
            <CPaginationItem disabled={currentPage === 1} onClick={() => fetchOrders(currentPage - 1)} ><CIcon icon={cilChevronLeft} /></CPaginationItem>
            {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
              <CPaginationItem key={i + 1} active={currentPage === i + 1} onClick={() => fetchOrders(i + 1)}>{i + 1}</CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage === Math.ceil(totalRecords / pageSize)} onClick={() => fetchOrders(currentPage + 1)}><CIcon icon={cilChevronRight} /></CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

export default OrderRequest;