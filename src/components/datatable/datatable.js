import { useEffect, useState, Fragment } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CSpinner,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSortAlphaDown,
  cilArrowTop,
  cilArrowBottom,
  cilChevronLeft,
  cilChevronRight,
} from '@coreui/icons'

import Loader from '../loader/loader'
import { localDateFormat } from '../../utils'
import { useTranslation } from 'react-i18next'

/* ---------------------------------- */

const DataTable = ({
  data = [],
  headers = [],
  totalRecords = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  isLoading = false,
}) => {
  /* ─────────────────────────── state */
  const [sortKey, setSortKey] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [dataList, setDataList] = useState(data)
  const { t } = useTranslation('common')

  const totalPages = Math.max(Math.ceil(totalRecords / pageSize), 1)

  /* ─────────────────────── sort handler */
  const handleSort = (key) => {
    const nextDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDirection(nextDirection)
  }

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      if (!sortKey) return 0

      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return sortDirection === 'asc'
        ? String(aVal ?? '').localeCompare(bVal ?? '')
        : String(bVal ?? '').localeCompare(aVal ?? '')
    })
    setDataList(sorted)
  }, [sortKey, sortDirection, data])

  /* ─────────────────────── pagination UI */
  const renderPagination = () => (
    <CPagination align="center" className="mt-3">
      <CPaginationItem disabled={currentPage === 1} onClick={() => onPageChange?.(currentPage - 1)}>
        <CIcon icon={cilChevronLeft} />
      </CPaginationItem>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <CPaginationItem key={p} active={p === currentPage} onClick={() => onPageChange?.(p)}>
          {p}
        </CPaginationItem>
      ))}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <CIcon icon={cilChevronRight} />
      </CPaginationItem>
    </CPagination>
  )

  /* ─────────────────────────────── JSX */
  return (
    <Fragment>
      <CTable responsive striped hover bordered>
        <CTableHead color="dark" className="align-middle ">
          <CTableRow>
            {headers.map(({ key, label, sortable }) => (
              <CTableHeaderCell
                key={key}
                role={sortable ? 'button' : undefined}
                scope="col"
                onClick={() => sortable && handleSort(key)}
                className="text-nowrap fw-medium"
              >
                {label}{' '}
                {/* {sortable && (
                  <CIcon
                    icon={
                      sortKey !== key
                        ? cilSortAlphaDown
                        : sortDirection === 'asc'
                          ? cilArrowTop
                          : cilArrowBottom
                    }
                    size="sm"
                  />
                )} */}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {isLoading ? (
            <CTableRow>
              <CTableDataCell colSpan={headers.length} className="text-center py-4">
                <Loader /> {/* or <CSpinner color="primary" /> */}
              </CTableDataCell>
            </CTableRow>
          ) : dataList.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={headers.length} className="text-center py-4">
                {t('No data found')}
              </CTableDataCell>
            </CTableRow>
          ) : (
            dataList.map((row, idx) => (
              <CTableRow key={idx}>
                {headers.map(({ key, format, render, style }) => {
                  const raw = row[key]
                  const value =
                    render?.(row) ?? (format === 'date' ? localDateFormat(raw) : String(raw))

                  return (
                    <CTableDataCell key={key} style={style} className="text-nowrap">
                      {value}
                    </CTableDataCell>
                  )
                })}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
      {totalPages > 1 && renderPagination()}
    </Fragment>
  )
}

export default DataTable
