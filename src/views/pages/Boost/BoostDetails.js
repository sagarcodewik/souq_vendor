import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/loader'
import { fetchBoosts, stopBoost, deleteBoost } from '../../../redux/slice/boosts'
import { cilStar, cilArrowTop, cilColorBorder } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next'

const BoostDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('boosts')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const {
    list: boosts,
    status,
    pageSize,
    currentPage,
    totalRecords,
  } = useSelector((state) => state.boosts)

  const fetch = useCallback(() => {
    dispatch(
      fetchBoosts({
        page: currentPage || 1,
        pageSize: pageSize || 10,
        search: searchTerm,
        boostType: selectedType,
      }),
    )
  }, [dispatch, currentPage, pageSize, searchTerm, selectedType])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handlePageChange = (page) => {
    fetch({ page })
  }

  const getStatusBadge = (boost) => {
    const colors = {
      active: '#22c55e',
      scheduled: '#f59e0b',
      expired: '#6b7280',
      stopped: '#ef4444',
    }

    return (
      <span
        className="badge"
        style={{
          backgroundColor: colors[boost.status],
          color: 'white',
          fontSize: '11px',
          padding: '4px 8px',
        }}
      >
        {boost.status}
      </span>
    )
  }

  const getBoostIcon = (type) => {
    if (type === 'featured') return cilStar
    if (type === 'top_of_list') return cilArrowTop
    return cilColorBorder
  }

  if (status === 'loading') return <Loader />

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 'bold', fontSize: '32px' }}>{t('Boosts')}</h2>
        <button
          onClick={() => navigate('/boosts/create')}
          className="btn text-white"
          style={{
            backgroundColor: '#0d9488',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: '600',
          }}
        >
          {t('New Boost')}
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder={t('Search by title...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '12px', padding: '12px' }}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ borderRadius: '12px', padding: '12px' }}
          >
            <option value="">{t('All Boost Types')}</option>
            <option value="featured">{t('Featured Badge')}</option>
            <option value="top_of_list">{t('Top of List')}</option>
            <option value="highlight">{t('Highlight Listing')}</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {!boosts || boosts.length === 0 ? (
        <div
          className="text-center p-5"
          style={{
            background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
            border: '2px dashed #93c5fd',
            borderRadius: '24px',
          }}
        >
          <h3>{searchTerm || selectedType ? 'No boosts found' : 'Create New Boost'}</h3>
          <p>
            {searchTerm || selectedType
              ? 'Try adjusting filters'
              : 'Increase product visibility and sales'}
          </p>
          {!searchTerm && !selectedType && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/boosts/create')}
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          {boosts.map((boost) => (
            <div key={boost._id} className="col-lg-6 mb-4">
              <div className="card border-0" style={{ borderRadius: '24px' }}>
                <div className="card-header bg-white d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <CIcon icon={getBoostIcon(boost.boost_type)} size="lg" />
                    <div className="ms-3">
                      <h4 style={{ fontWeight: 700 }}>{boost.boost_type}</h4>
                      <small>{boost.scope_type}</small>
                    </div>
                  </div>
                  {getStatusBadge(boost)}
                </div>

                <div className="card-body">
                  <p>
                    <strong>Duration:</strong> {boost.duration.value} {boost.duration.unit}
                  </p>
                  <p>
                    <strong>Scope:</strong>{' '}
                    {boost.scope_type === 'product'
                      ? `${boost.scope_ids.length} Products`
                      : 'Category'}
                  </p>
                  <p>
                    <strong>Cost:</strong> {boost.price} SYP
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={() => navigate(`/boosts/${boost._id}`)}
                    >
                      View
                    </button>

                    {boost.status === 'active' && (
                      <button
                        className="btn btn-outline-warning flex-fill"
                        onClick={() => dispatch(stopBoost(boost._id))}
                      >
                        Stop
                      </button>
                    )}

                    {(boost.status === 'draft' || boost.status === 'expired') && (
                      <button
                        className="btn btn-outline-danger flex-fill"
                        onClick={() => dispatch(deleteBoost(boost._id))}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BoostDetails
