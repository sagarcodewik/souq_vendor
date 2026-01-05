import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CNav, CNavItem, CNavLink } from '@coreui/react'
import { fetchVendorOrders } from '../../../redux/slice/order'
import Loader from '../../../components/loader/loader'
import DataTable from '../../../components/datatable/datatable'
import { ReturnedOrderHeaders } from '../../../utils/header'

const TABS = {
  INTRACITY: { key: 'intracity', label: 'Intracity', type: '1' },
  INTERCITY: { key: 'intercity', label: 'Intercity', type: '2' },
}

const Return_order = () => {
  const dispatch = useDispatch()
  const { orders, status, error, currentPage, pageSize, totalRecords, sortKey, sortDirection } =
    useSelector((state) => state.orders)

  const [activeTab, setActiveTab] = useState(TABS.INTRACITY)
  const [loadingOrderId, setLoadingOrderId] = useState(null)

  const fetchOrders = useCallback(
    (page = currentPage, sortK = sortKey, sortD = sortDirection) => {
      dispatch(
        fetchVendorOrders({
          status: 'returned',
          type: activeTab.type,
          page,
          pageSize,
          sortKey: sortK,
          sortDirection: sortD,
        }),
      )
    },
    [dispatch, activeTab.type, currentPage, pageSize, sortKey, sortDirection],
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

  return (
    <div className="p-4">
      <h4 className="text-xl font-semibold mb-4">Returned Orders</h4>

      {/* Tabs */}
      <CNav variant="tabs" className="mb-4">
        {Object.values(TABS).map((tab) => (
          <CNavItem key={tab.key}>
            <CNavLink
              active={activeTab.key === tab.key}
              onClick={() => handleTabChange(tab)}
              role="button"
              style={{ cursor: 'pointer' }}
            >
              {tab.label}
            </CNavLink>
          </CNavItem>
        ))}
      </CNav>

      {/* Table */}
      {error && <p className="text-danger mb-2">Error: {error}</p>}
      {status === 'loading' ? (
        <Loader />
      ) : (
        <DataTable
          data={orders}
          headers={ReturnedOrderHeaders(loadingOrderId)}
          isLoading={status === 'loading'}
          pageSize={pageSize}
          currentPage={currentPage}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      )}
    </div>
  )
}

export default Return_order
