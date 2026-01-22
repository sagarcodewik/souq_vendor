import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilStar, cilBolt, cilLayers } from '@coreui/icons'
import { useTranslation } from 'react-i18next'

import Loader from '../../../components/loader/loader'
import { fetchBoosts, deleteBoost } from '../../../redux/slice/boosts'
import PromotionTabing from '../promotion/PromotionTabing'

const Boots = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('boosts')

  /* ================= REDUX STATE ================= */
  const { list: boosts, loading } = useSelector((state) => state.boosts)

  const [deletingId, setDeletingId] = useState(null)

  /* ================= FETCH BOOSTS ================= */
  useEffect(() => {
    dispatch(fetchBoosts({}))
  }, [dispatch])

  /* ================= DELETE BOOST ================= */
  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await dispatch(deleteBoost(id)).unwrap()
      dispatch(fetchBoosts({}))
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeletingId(null)
    }
  }

  /* ================= HELPERS ================= */
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB')

  const badge = (text, color) => (
    <span
      className="badge"
      style={{
        backgroundColor: color,
        color: 'white',
        fontSize: '11px',
        padding: '4px 8px',
      }}
    >
      {text}
    </span>
  )

  const getStatusBadge = (boost) => {
    const colors = {
      active: '#22c55e',
      scheduled: '#f59e0b',
      expired: '#6b7280',
      stopped: '#ef4444',
      draft: '#94a3b8',
    }

    return badge(boost.status.toUpperCase(), colors[boost.status] || '#94a3b8')
  }

  const getBoostIcon = (type) => {
    switch (type) {
      case 'featured':
        return cilStar
      case 'top_of_list':
        return cilBolt
      case 'highlight':
        return cilLayers
      default:
        return cilStar
    }
  }

  /* ================= UI ================= */
  return (
   
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: '700', fontSize: '32px' }}>{t('Boosts')}</h2>

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

      {/* ================= LOADING ================= */}
      {loading ? (
        <Loader />
      ) : !boosts || boosts.length === 0 ? (
        /* ================= EMPTY STATE ================= */
        <div
          className="text-center p-5"
          style={{
            background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
            border: '2px dashed #93c5fd',
            borderRadius: '24px',
          }}
        >
          <h3>{t('No Boosts Found')}</h3>
          <p>{t('Create your first boost to increase visibility')}</p>
        </div>
      ) : (
        /* ================= LIST ================= */
        <div className="row">
          {boosts.map((boost) => (
            <div key={boost._id} className="col-lg-6 mb-4">
              <div
                className="card border-0"
                style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              >
                {/* HEADER */}
                <div className="card-header bg-white border-bottom p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                        }}
                      >
                        <CIcon icon={getBoostIcon(boost.boost_type)} size="lg" />
                      </div>

                      <div>
                        <h5 className="mb-1">{boost.boost_type.replace('_', ' ').toUpperCase()}</h5>
                        <small className="text-muted">Scope: {boost.scope_type}</small>
                      </div>
                    </div>

                    {getStatusBadge(boost)}
                  </div>
                </div>

                {/* BODY */}
                <div className="card-body p-4">
                  <div className="row mb-3">
                    <div className="col-6">
                      <strong>Start Date</strong>
                      <div>{formatDate(boost.start_date)}</div>
                    </div>
                    <div className="col-6">
                      <strong>End Date</strong>
                      <div>{formatDate(boost.end_date)}</div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <strong>Duration</strong>
                      <div>
                        {boost.duration.value} {boost.duration.unit}
                      </div>
                    </div>
                    <div className="col-6">
                      <strong>Price</strong>
                      <div>{boost.price} SYP</div>
                    </div>
                  </div>

                  {/* PRODUCT NAMES */}

                  <div className="mb-3">
                    <strong>Products</strong>
                    <ul className="mt-1">
                      {boost.scope_ids.map((product) => (
                        <li key={product._id}>{product.productName || product.name}</li>
                      ))}
                    </ul>
                  </div>


                  <button
                    onClick={() => handleDelete(boost._id)}
                    disabled={deletingId === boost._id}
                    className="btn btn-outline-danger flex-fill"
                  >
                    {deletingId === boost._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Boots
