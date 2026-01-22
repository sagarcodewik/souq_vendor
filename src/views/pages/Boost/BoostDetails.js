import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/loader'
import { fetchBoosts, stopBoost, deleteBoost } from '../../../redux/slice/boosts'
import { cilStar, cilArrowTop, cilColorBorder } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next'
import PromotionTabing from '../promotion/PromotionTabing'
import './style.scss'
import { ChartNoAxesCombined, Tag, Target, UsersRound } from 'lucide-react'

const BoostDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('boosts')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const {list: boosts, status, pageSize, currentPage, totalRecords,} = useSelector((state) => state.boosts)
  const fetchBoostsData = useCallback(() => {dispatch(fetchBoosts({page: currentPage || 1, pageSize: pageSize || 10, search: searchTerm, boostType: selectedType,}),)
  }, [dispatch, currentPage, pageSize, searchTerm, selectedType])

  useEffect(() => {fetchBoostsData()}, [fetchBoostsData])

  const handlePageChange = (page) => {fetchBoostsData({ page })}
  const getStatusClass = (status) => `boost-status boost-status-${status}`
  const getBoostIcon = (type) => {
    if (type === 'featured') return cilStar
    if (type === 'top_of_list') return cilArrowTop
    return cilColorBorder
  }

  if (status === 'loading') return <Loader />

  return (
    <>
      <PromotionTabing />
      <div className="container-fluid boost-container">
        {/* HEADER */}
        <div className="boost-header">
          <div>
            <h2 className="boost-title">{t('Boost Products')}</h2>
            <p className="boost-subtitle">{t('Manage your visibility campaigns and boost performance')}</p>
          </div>
          <button onClick={() => navigate('/boosts/create')} className="btn boost-create-btn"> + {t('New Campaign')}</button>
        </div>

        {/* FILTERS */}
        <div className="boost-filter-card">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="boost-search-wrapper">
                <span className="boost-search-icon">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input className="form-control boost-search-input" placeholder={t('Search by title...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
            </div>

            <div className="col-md-3">
              <select className="form-select boost-type-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">{t('All Types')}</option>
                <option value="featured">{t('Featured Badge')}</option>
                <option value="top_of_list">{t('Top of List')}</option>
                <option value="highlight">{t('Highlight Listing')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {!boosts || boosts.length === 0 ? (
          <div className="boost-empty-state">
            <div className="boost-empty-icon"><CIcon icon={cilStar} size="3xl" /></div>
            <h3>No active promotions</h3>
            <p>Start a new campaign to boost your visibility</p>
            {!searchTerm && !selectedType && (
              <button className="btn btn-primary px-4 py-2 rounded-pill" onClick={() => navigate('/boosts/create')}>Create Campaign</button>
            )}
          </div>
        ) : (
          <div className="row g-3 g-lg-4 mb-4">
            {boosts.map((boost) => (
              <div key={boost._id} className="col-lg-4 col-md-6">
                <div className="boost-card">
                  <div className={`boost-accent ${boost.status}`} />

                  <div className="card-body d-flex flex-column">
                    <div className="boost-card-header">
                      <div className="boost-icon"><CIcon icon={getBoostIcon(boost.boost_type)} size="xl" /></div>
                      <div className="boost-info">
                        <h5>{boost.boost_type?.replace('_', ' ').toUpperCase()}</h5>
                        <span>{boost.scope_type}</span>
                      </div>
                      <span className={getStatusClass(boost.status)}>{boost.status}</span>
                    </div>
                    <div className="boost-info-grid">
                      <div>
                        <small>Duration</small>
                        <strong>{boost.duration.value} {boost.duration.unit}</strong>
                      </div>
                      <div>
                        <small>Cost</small>
                        <strong>{boost.price.toLocaleString()} SYP</strong>
                      </div>
                      <div className="full">
                        <small>Target</small>
                        <span>{boost.scope_type === 'product' ? `${boost.scope_ids.length} Product(s)` : 'Entire Category'}</span>
                      </div>
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn boost-edit-btn flex-fill" onClick={() => navigate(`/boosts/update?id=${boost._id}`)}>Edit</button>
                      {boost.status === 'active' && (
                        <button
                          className="btn btn-outline-warning flex-fill"
                          onClick={() => dispatch(stopBoost(boost._id))}
                        >
                          Stop
                        </button>
                      )}

                      {(boost.status === 'draft' ||
                        boost.status === 'expired' ||
                        boost.status === 'stopped') && (
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
            <div className="col-md-12">
              <h3 className="fw-bold mb-3">Why Promote Your Product ?</h3>
              <div className="row g-3 g-lg-4">
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="promo-card text-center h-100">
                    <div className="icon-wrap bg-orange mb-3">
                      <Target size={32} color="#FFF" />
                    </div>
                    <h5 className="fw-bold">Targeted Reach</h5>
                    <p className="text-muted mb-0">
                      Get in front of high-intent customers
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="promo-card text-center h-100">
                    <div className="icon-wrap bg-blue mb-3">
                      <UsersRound size={32} color="#FFF" />
                    </div>
                    <h5 className="fw-bold">Consistent Traffic</h5>
                    <p className="text-muted mb-0">
                      Maintain visibility beyond organic discovery
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="promo-card text-center h-100">
                    <div className="icon-wrap bg-red mb-3">
                      <Tag size={32} color="#FFF" />
                    </div>
                    <h5 className="fw-bold">Sales Momentum</h5>
                    <p className="text-muted mb-0">
                      Ideal for launches, offers, and high-priority products
                    </p>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="promo-card text-center h-100">
                    <div className="icon-wrap bg-green mb-3">
                      <ChartNoAxesCombined size={32} color="#FFF" />
                    </div>
                    <h5 className="fw-bold">Smarter Growth</h5>
                    <p className="text-muted mb-0">
                      Spend where performance matters most
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default BoostDetails;