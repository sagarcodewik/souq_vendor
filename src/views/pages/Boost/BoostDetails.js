import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/loader'
import { fetchBoosts, stopBoost, deleteBoost } from '../../../redux/slice/boosts'
import { cilStar, cilArrowTop, cilColorBorder, cilTrash } from '@coreui/icons'
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { bg: '#d1fae5', text: '#059669', border: '#10b981' } // Emerald
      case 'scheduled':
        return { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' } // Amber
      case 'expired':
        return { bg: '#f3f4f6', text: '#4b5563', border: '#9ca3af' } // Gray
      case 'stopped':
        return { bg: '#fee2e2', text: '#dc2626', border: '#ef4444' } // Red
      default:
        return { bg: '#f3f4f6', text: '#4b5563', border: '#9ca3af' }
    }
  }

  const getBoostIcon = (type) => {
    if (type === 'featured') return cilStar
    if (type === 'top_of_list') return cilArrowTop
    return cilColorBorder
  }

  if (status === 'loading') return <Loader />

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #eef2ff 100%)',
        padding: '32px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '1400px' }}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2
              className="mb-1"
              style={{
                fontWeight: '800',
                fontSize: '36px',
                background: 'linear-gradient(45deg, #1e293b, #334155)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              {t('Boost Products')}
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
              {t('Manage your visibility campaigns and boost performance')}
            </p>
          </div>
          <button
            onClick={() => navigate('/boosts/create')}
            className="btn text-white"
            style={{
              backgroundColor: '#0d9488',
              borderColor: '#0d9488',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            + {t('New Campaign')}
          </button>
        </div>

        {/* Filter Bar */}
        <div
          className="card border-0 mb-5 shadow-sm"
          style={{
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="card-body p-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-5">
                <div className="position-relative">
                  <span
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    className="form-control"
                    placeholder={t('Search by title...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 12px 12px 48px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '15px',
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">{t('All Types')}</option>
                  <option value="featured">{t('Featured Badge')}</option>
                  <option value="top_of_list">{t('Top of List')}</option>
                  <option value="highlight">{t('Highlight Listing')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {!boosts || boosts.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px dashed #cbd5e1',
            }}
          >
            <div
              className="mb-4 d-inline-flex justify-content-center align-items-center"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#3b82f6',
              }}
            >
              <CIcon icon={cilStar} size="3xl" />
            </div>
            <h3 className="text-dark fw-bold mb-2">No active promotions</h3>
            <p className="text-muted mb-4">Start a new campaign to boost your visibility</p>
            {!searchTerm && !selectedType && (
              <button
                className="btn btn-primary px-4 py-2 rounded-pill"
                onClick={() => navigate('/boosts/create')}
              >
                Create Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {boosts.map((boost) => {
              const statusStyle = getStatusStyle(boost.status)
              return (
                <div key={boost._id} className="col-lg-4 col-md-6">
                  <div
                    className="card h-100 border-0"
                    style={{
                      borderRadius: '24px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'white',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'default',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Top Accent Strip */}
                    <div
                      style={{
                        height: '6px',
                        background:
                          boost.status === 'active'
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : '#e2e8f0',
                      }}
                    />

                    <div className="card-body p-4 d-flex flex-column">
                      {/* Card Header */}
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="d-flex justify-content-center align-items-center shadow-sm"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '14px',
                              background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                              border: '1px solid #e2e8f0',
                              color: '#4f46e5',
                            }}
                          >
                            <CIcon icon={getBoostIcon(boost.boost_type)} size="xl" />
                          </div>
                          <div className="ms-3">
                            <h5
                              className="mb-0 text-dark"
                              style={{ fontWeight: '700', fontSize: '17px' }}
                            >
                              {boost.boost_type
                                ? boost.boost_type.replace('_', ' ').toUpperCase()
                                : 'BOOST'}
                            </h5>
                            <span
                              className="text-muted"
                              style={{ fontSize: '13px', textTransform: 'uppercase' }}
                            >
                              {boost.scope_type}
                            </span>
                          </div>
                        </div>
                        <span
                          className="px-3 py-1 rounded-pill"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            fontSize: '11px',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            boxShadow: `0 0 0 1px ${statusStyle.border}20`,
                          }}
                        >
                          {boost.status}
                        </span>
                      </div>

                      {/* Info Grid */}
                      <div
                        className="row g-2 mb-4 p-3 rounded-4"
                        style={{ backgroundColor: '#f8fafc' }}
                      >
                        <div className="col-6">
                          <small className="text-secondary d-block mb-1" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                            Duration
                          </small>
                          <span className="text-dark fw-bold">
                            {boost.duration.value} {boost.duration.unit}
                          </span>
                        </div>
                        <div className="col-6">
                          <small className="text-secondary d-block mb-1" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                            Cost
                          </small>
                          <span className="text-dark fw-bold">{boost.price.toLocaleString()} SYP</span>
                        </div>
                        <div className="col-12 mt-3 pt-2 border-top">
                          <small className="text-secondary d-block mb-1" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                            Target
                          </small>
                          <span className="text-dark fw-medium" style={{ fontSize: '14px' }}>
                            {boost.scope_type === 'product'
                              ? `${boost.scope_ids.length} Product(s)`
                              : 'Entire Category'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto d-flex gap-2">
                        <button
                          onClick={() => navigate(`/boosts/update?id=${boost._id}`)}
                          className="flex-fill btn text-white"
                          style={{
                            backgroundColor: '#0d9488',
                            borderColor: '#0d9488',
                            borderRadius: '12px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            fontWeight: '500',
                          }}
                        >
                          <i className="fas fa-edit me-1" style={{ fontSize: '12px' }}></i>
                          {t('Edit')}
                        </button>

                        {boost.status === 'active' && (
                          <button
                            className="flex-fill btn btn-outline-warning"
                            onClick={() => dispatch(stopBoost(boost._id))}
                            style={{
                              borderRadius: '12px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                          >
                            <i className="fas fa-pause me-1" style={{ fontSize: '12px' }}></i>
                            Stop
                          </button>
                        )}
                        {(boost.status === 'draft' || boost.status === 'expired' || boost.status === 'stopped') && (
                          <button
                            className="flex-fill btn btn-outline-danger"
                            style={{
                              borderRadius: '12px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                            onClick={() => dispatch(deleteBoost(boost._id))}
                          >
                            <i className="fas fa-trash me-1" style={{ fontSize: '12px' }}></i>
                            {t('Delete')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BoostDetails
