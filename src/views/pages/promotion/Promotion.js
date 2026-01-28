import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import Loader from '../../../components/loader/loader'
import { fetchPromotions, deletePromotion } from '../../../redux/slice/promotion'
import ProductDetailsModal from './ProductDetailsModal'
import { cilTag, cilBolt, cilGift } from '@coreui/icons'
import { useTranslation } from 'react-i18next'
import './style.scss'
import { Formik } from 'formik'
import {
  ArrowRight,
  Box,
  Calendar,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Layers,
  Megaphone,
  Pencil,
  Percent,
  PlusCircle,
  Sparkles,
  Tag,
  Target,
  Trash2,
  UsersRound,
} from 'lucide-react'
import { CButton } from '@coreui/react'
import { CiSearch } from 'react-icons/ci'
import PromotionTabing from './PromotionTabing'

const Promotion = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('promotions')
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    list: promotions,
    status,
    pageSize,
    currentPage,
    totalRecords,
    sortKey,
    sortDirection,
  } = useSelector((state) => state.promotion)

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const fetch = useCallback(() => {
    dispatch(
      fetchPromotions({
        page: currentPage || 1,
        pageSize: pageSize || 10,
        sortKey: sortKey || 'createdAt',
        sortDirection: sortDirection || 'desc',
        search: searchTerm,
        type: selectedType,
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection, searchTerm, selectedType])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handlePageChange = (page) => {
    dispatch(
      fetchPromotions({
        page,
        pageSize,
        sortKey,
        sortDirection,
        search: searchTerm,
        type: selectedType,
      }),
    )
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await dispatch(deletePromotion(id)).unwrap()
      fetch()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (promotion) => {
    const currentDate = new Date()
    const startDate = new Date(promotion.startDate)
    if (promotion.type === 'flash-sale') {
      const endTime = new Date(startDate)
      endTime.setHours(endTime.getHours() + promotion.hours)

      if (currentDate < startDate) {
        return badge('Scheduled', '#f59e0b')
      }

      if (currentDate >= startDate && currentDate <= endTime) {
        return badge('Active', '#22c55e')
      }

      return badge('Expired', '#6b7280')
    }
    const endDate = new Date(promotion.endDate)
    if (currentDate < startDate) return badge('Scheduled', '#f59e0b')
    if (currentDate > endDate) return badge('Expired', '#6b7280')
    return badge('Active', '#22c55e')
  }

  const badge = (text, color) => (
    <span className="promotion-status-badge" style={{ backgroundColor: color }}>
      {' '}
      {text}
    </span>
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB')
  }

  if (status === 'loading' || deleting) {
    return <Loader />
  }

  const getDiscountDisplay = (promotion) => {
    if (promotion.discountType === 'Percentage') {
      return { value: `${promotion.discountValue}%`, label: 'OFF' }
    }
    return { value: `${promotion.discountValue} SYP`, label: 'OFF' }
  }
  return (
    <>
      {/* <PromotionTabing /> */}
      <div className="promotion-header d-flex justify-content-between align-items-center mb-3">
        <h2 className="promotion-title mb-0">{t('Discount')}</h2>
        <button
          onClick={() => navigate('/promotions/create')}
          className="btn promotion-btn text-white"
        >
          {t('New Discount')}
        </button>
      </div>
      <div className="row gx-3 mb-3 promotion-filters">
        <div className="col-md-8">
          <div className="position-relative">
            <input
              type="text"
              className="form-control promotion-search-input"
              placeholder={t('Search by title...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <CiSearch size={22} className="promotion-search-icon" />
          </div>
        </div>

        <div className="col-md-4">
          <select
            className="form-select promotion-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">{t('All Types')}</option>
            <option value="promotion">{t('Discount')}</option>
            <option value="flash-sale">{t('Flash Sale')}</option>
            <option value="bundle">{t('Bundle')}</option>
          </select>
        </div>
      </div>
      {!promotions || promotions.length === 0 ? (
        <div className="promotion-empty-state text-center p-5">
          <div className="mb-3">
            <PlusCircle size={64} className="empty-icon" />
          </div>
          <h3 className="empty-title">
            {' '}
            {searchTerm || selectedType ? t('No discount found') : t('Create New Discount')}
          </h3>
          <p className="empty-subtitle">
            {searchTerm || selectedType
              ? t('Try adjusting your filters')
              : t('Start building your next promotional campaign')}
          </p>
          {!searchTerm && !selectedType && (
            <button
              onClick={() => navigate('/promotions/create')}
              className="btn btn-primary empty-btn"
            >
              {t('Get Started')}
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3 g-lg-4 mb-4">
          {promotions.map((promotion) => (
            <div key={promotion._id || promotion.id} className="col-lg-6 d-flex">
              <div className="promotion-card card border-0 w-100 d-flex flex-column">
                {/* HEADER */}
                <div className="promotion-card-header card-header bg-white border-bottom">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      <div className="promotion-icon-wrapper me-3">
                        <CIcon
                          icon={
                            promotion.type === 'promotion'
                              ? cilTag
                              : promotion.type === 'flash-sale'
                                ? cilBolt
                                : promotion.type === 'bundle'
                                  ? cilGift
                                  : cilTag
                          }
                          size="lg"
                        />
                      </div>
                      <div>
                        <h4 className="promotion-card-title mb-1 d-flex align-items-center gap-2">
                          {promotion.title}

                          {/* BOOST BADGE */}
                          {promotion.boost?.isApplied && (
                            <span className="badge bg-warning text-dark">
                              BOOST • {promotion.boost.type.toUpperCase()}
                            </span>
                          )}
                        </h4>

                        <p className="promotion-card-type mb-0">{promotion.type}</p>
                      </div>
                    </div>
                    {getStatusBadge(promotion)}
                  </div>
                </div>

                {/* BODY */}
                <div className="promotion-card-body card-body d-flex flex-column">
                  {/* STATS */}
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <div className="promo-stat promo-discount h-100">
                        <div className="d-flex align-items-center mb-1">
                          <Percent size={14} className="me-2" />
                          <small>Discount</small>
                        </div>
                        <div className="promo-value">{getDiscountDisplay(promotion).value}</div>
                        <small className="promo-label">{getDiscountDisplay(promotion).label}</small>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="promo-stat promo-start h-100">
                        <div className="d-flex align-items-center mb-1">
                          <Calendar size={14} className="me-2" />
                          <small>Start Date</small>
                        </div>
                        <div className="promo-date">{formatDate(promotion.startDate)}</div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="promo-stat promo-end h-100">
                        <div className="d-flex align-items-center mb-1">
                          <Calendar size={14} className="me-2" />
                          <small>{promotion.endDate ? 'End Date' : 'Hours'}</small>
                        </div>
                        <div className="promo-date">
                          {promotion.endDate
                            ? formatDate(promotion.endDate)
                            : `${promotion.hours} Hours`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS TABLE */}
                  {promotion.productIds?.length > 0 && (
                    <div className="promotion-products mb-3">
                      <div className="products-header d-flex align-items-center mb-3">
                        <Box size={22} /> <span>Products</span>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm promotion-products-table mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Product Name</th>
                              <th>Price (SYP)</th>
                              <th>Category</th>
                            </tr>
                          </thead>

                          <tbody>
                            {promotion.productIds.slice(0, 3).map((product, index) => (
                              <tr key={product._id || index}>
                                <td>{index + 1}</td>
                                <td
                                  className="product-link"
                                  onClick={() => handleProductClick(product)}
                                >
                                  {product.productName || product.name || 'N/A'}
                                </td>
                                <td>{product.discountedprice || product.price || 'N/A'}</td>
                                <td>{product.category?.category || product.category || 'N/A'}</td>
                              </tr>
                            ))}

                            {promotion.productIds.length > 3 && (
                              <tr className="more-products-row">
                                <td colSpan="4">
                                  … and {promotion.productIds.length - 3} more products
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* CATEGORIES */}
                  {promotion.scopeType === 'category' && promotion.categoryIds?.length > 0 && (
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <Layers size={22} /> <span className="category-title">Categories</span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {promotion.categoryIds.map((cat) => (
                          <span key={cat._id} className="promotion-category-pill">
                            {cat.category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS (ALWAYS AT BOTTOM) */}
                  <div className="mt-auto d-flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/promotions/update?id=${promotion._id || promotion.id}`)
                      }
                      className="btn promotion-edit-btn flex-fill"
                    >
                      <Pencil size={14} className="me-1" /> {t('Edit')}
                    </button>

                    <button
                      onClick={() => handleDelete(promotion._id || promotion.id)}
                      className="btn btn-outline-danger promotion-delete-btn flex-fill"
                      disabled={deleting}
                    >
                      <Trash2 size={14} className="me-1" /> {t('Delete')}
                    </button>
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
                  <p className="text-muted mb-0">Get in front of high-intent customers</p>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <div className="promo-card text-center h-100">
                  <div className="icon-wrap bg-blue mb-3">
                    <UsersRound size={32} color="#FFF" />
                  </div>
                  <h5 className="fw-bold">Consistent Traffic</h5>
                  <p className="text-muted mb-0">Maintain visibility beyond organic discovery</p>
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
                  <p className="text-muted mb-0">Spend where performance matters most</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {totalRecords > pageSize && (
        <div className="promotion-pagination d-flex justify-content-between align-items-center mt-4 p-4">
          <div className="pagination-info">
            Showing {(currentPage - 1) * pageSize + 1}-{' '}
            {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} promotions
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline-secondary pagination-btn"
            >
              <ChevronLeft size={14} />
            </button>
            <button className="btn btn-primary pagination-current">{currentPage}</button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
              className="btn btn-outline-secondary pagination-btn"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default Promotion
