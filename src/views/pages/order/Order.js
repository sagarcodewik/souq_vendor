import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { fetchVendorOrders, updateOrderStatus } from '../../../redux/slice/order'
import { CNav, CNavItem, CNavLink, CPagination, CPaginationItem } from '@coreui/react'
import Loader from '../../../components/loader/loader'
import styles from './order.module.scss'
import OrderCard from '../../../components/OrderCard'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

/* ───────── constants ───────── */
const STATUS_OPTIONS = [
  { labelKey: 'all', value: '' },
  { labelKey: 'pending', value: 'pending' },
  { labelKey: 'confirmed', value: 'confirmed' },
  { labelKey: 'ready', value: 'Ready' },
  { labelKey: 'shipped', value: 'shipped' },
  { labelKey: 'in_transit', value: 'in-transit' },
  { labelKey: 'delivered', value: 'delivered' },
  { labelKey: 'cancelled', value: 'cancelled' },
  { labelKey: 'returned', value: 'returned' },
]
const TABS = {
  INTRACITY: { key: 'intracity', labelKey: 'intracity', type: '1' },
  INTERCITY: { key: 'intercity', labelKey: 'market_place', type: '2' },
}

const OrderRequest = () => {
  const dispatch = useDispatch()
  const { orders, status, error, currentPage, pageSize, totalRecords, sortKey, sortDirection } =
    useSelector((s) => s.orders)

  const [selectedStatus, setSelectedStatus] = useState('')
  const [activeTab, setActiveTab] = useState(TABS.INTRACITY)
  const [loadingId, setLoadingId] = useState(null)
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const { t } = useTranslation('approvedorder')

  // 🔎 Search
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500) // ⏱️ 500ms debounce
    return () => clearTimeout(handler)
  }, [searchTerm])

  /* ───────── fetch list ───────── */
  const loadOrders = useCallback(
    (page = currentPage, sortK = sortKey, sortDir = sortDirection) =>
      dispatch(
        fetchVendorOrders({
          status: selectedStatus,
          type: activeTab.type,
          search: debouncedSearch, // ✅ search added
          page,
          pageSize,
          sortKey: sortK,
          sortDirection: sortDir,
        }),
      ),
    [
      currentPage,
      sortKey,
      sortDirection,
      dispatch,
      selectedStatus,
      activeTab.type,
      pageSize,
      debouncedSearch,
    ],
  )

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    if (tabFromUrl === 'market_place') {
      setActiveTab(TABS.INTERCITY)
    }
  }, [tabFromUrl])

  /* ───────── handlers ───────── */
  const handlePageChange = (page) => loadOrders(page)
  const handleSort = (key, dir) => loadOrders(currentPage, key, dir)
  const handleTabChange = (tab) => setActiveTab(tab)

  const markAsReady = async (orderId) => {
    try {
      setLoadingId(orderId)
      const token = localStorage.getItem('token')
      const { id: vendorId } = jwtDecode(token)
      await dispatch(updateOrderStatus({ orderId, status: 'Ready', vendorId })).unwrap()
      loadOrders()
    } catch (err) {
      /* already toasted in thunk */
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="p-4">
      {/* heading + filters + search */}
      <div className="d-flex flex-row mb-3 justify-content-between align-items-center flex-wrap gap-3">
        <h4 className="text-xl font-semibold mb-0">{t('Orders')}</h4>
        <div className="d-flex flex-row align-items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="d-flex flex-row align-items-center gap-2">
            <label htmlFor="statusFilter" className="mb-0 w-auto">
              {t('Filter by Status')}:
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select w-auto"
            >
              {STATUS_OPTIONS.map(({ labelKey, value }) => (
                <option key={value} value={value}>
                  {t(labelKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Search bar */}
          <div style={{ maxWidth: '300px' }}>
            <input
              type="text"
              placeholder={t('Search by order number')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}

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
              {t(tab.labelKey)}
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>

      {/* Orders List */}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}
      {status === 'loading' ? (
        <Loader />
      ) : (
        <>
          <div className="mt-4">
            {orders.length === 0 ? (
              <div className="text-center">
                <p className="text-muted ">{t('No orders found')}</p>
              </div>
            ) : (
              <div className={styles.orderList}>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    loading={loadingId === order._id}
                    onStatusChange={markAsReady}
                    type="ready"
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
