import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorOrders, updateOrderStatus } from '../../../redux/slice/order'
import DataTable from '../../../components/datatable/datatable'
import { OrderRequestHeaders } from '../../../utils/header'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { CNav, CNavItem, CNavLink, CPagination, CPaginationItem } from '@coreui/react'
import Loader from '../../../components/loader/loader'
import styles from './orderRequest.module.scss'
import OrderCard from '../../../components/OrderCard'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'

const TABS = {
  INTRACITY: { key: 'intracity', label: '15 min', type: '1' },
  INTERCITY: { key: 'intercity', label: 'Market Place', type: '2' },
}

const OrderRequest = () => {
  const dispatch = useDispatch()
  const { orders, status, error, currentPage, pageSize, totalRecords, sortKey, sortDirection } =
    useSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState(TABS.INTRACITY)
  const [loadingOrderId, setLoadingOrderId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('') // 🔥 search state
  const [debouncedSearch, setDebouncedSearch] = useState('') // 🔥 debounced state

  // 🔥 Debounce logic: update debouncedSearch 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
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

  const handlePageChange = (page) => {
    fetchOrders(page)
  }

  const handleSort = (key, direction) => {
    fetchOrders(currentPage, key, direction)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

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
      console.error('Failed to update order status:', err)
    } finally {
      setLoadingOrderId(null)
    }
  }

  return (
    <div className="p-4">
      <div className="d-flex flex-row mb-3 justify-content-between align-items-center flex-wrap gap-3">
        <h4 className="text-xl font-semibold mb-4">Pending Order Requests</h4>
        <div className="d-flex flex-row align-items-center gap-3 flex-wrap">
          {/* 🔥 Search bar */}
          <div className="mt-3 mb-3">
            <input
              type="text"
              placeholder="Search by order number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ maxWidth: '300px' }}
            />
          </div>
        </div>
      </div>
      {/* Tab buttons */}
      <CNav variant="tabs" className={styles.tabContainer}>
        {Object.values(TABS).map((tab) => (
          <CNavItem key={tab.key} className={styles.tabItem}>
            <CNavLink
              active={activeTab.key === tab.key}
              onClick={() => handleTabChange(tab)}
              role="button"
              className={styles.tabLink}
              style={{
                fontWeight: activeTab.key === tab.key ? 'bold' : 'normal',
                color: activeTab.key === tab.key ? '#0b737f' : '#64748b',
                background: activeTab.key === tab.key ? '#e0e7ff' : 'transparent',
              }}
            >
              {tab.key === 'intracity' ? (
                <span style={{ marginRight: '6px' }}>🏍️</span>
              ) : (
                <span style={{ marginRight: '6px' }}>🚌</span>
              )}
              {tab.label}
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>

      {error && <p className="text-red-500 mb-2">Error: {error}</p>}
      {status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <div className="mt-4">
            {orders.length === 0 ? (
              <div className="text-center">
                <p className="text-muted ">No orders found.</p>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    loading={loadingOrderId === order._id}
                    onStatusChange={handleStatusChange}
                    type="request"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      {orders.length > 0 && Math.ceil(totalRecords / pageSize) > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <CPagination align="center">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </CPaginationItem>

            {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
              <CPaginationItem
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={currentPage === Math.ceil(totalRecords / pageSize)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  )
}

export default OrderRequest
