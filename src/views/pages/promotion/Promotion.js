import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import DataTable from '../../../components/datatable/datatable'
import Loader from '../../../components/loader/loader'
import { fetchPromotions, deletePromotion } from '../../../redux/slice/promotion'
import { PromotionHeaders } from '../../../utils/header'
import ProductDetailsModal from './ProductDetailsModal' 

const Promotion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  
  // Modal state
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

  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleView = (promotion) => {
    setSelectedPromotion(promotion)
    setShowModal(true)
  }

  // Handle product click
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
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection])

  useEffect(() => {
    fetch()
  }, [fetch])

  const handlePageChange = (page) => {
    dispatch(fetchPromotions({ page, pageSize, sortKey, sortDirection }))
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
    const isActive = promotion.isActive
    const currentDate = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)

    if (isActive && currentDate >= startDate && currentDate <= endDate) {
      return (
        <span
          className="badge"
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            fontSize: '11px',
            padding: '4px 8px',
          }}
        >
          Active
        </span>
      )
    } else if (currentDate < startDate) {
      return (
        <span
          className="badge"
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            fontSize: '11px',
            padding: '4px 8px',
          }}
        >
          Scheduled
        </span>
      )
    } else {
      return (
        <span
          className="badge"
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            fontSize: '11px',
            padding: '4px 8px',
          }}
        >
          Expired
        </span>
      )
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') // DD/MM/YYYY format
  }

  const filteredPromotions =
    promotions?.filter((promotion) => {
      const matchesSearch =
        promotion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.promotionCode?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'All Types' || promotion.type === selectedType
      return matchesSearch && matchesType
    }) || []

  if (status === 'loading' || deleting) {
    return <Loader />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '24px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0" style={{ color: '#111827', fontWeight: 'bold', fontSize: '32px' }}>
          Promotions
        </h2>
        <button
          onClick={() => navigate('/promotions/create')}
          className="btn text-white"
          style={{
            backgroundColor: '#0d9488',
            borderColor: '#0d9488',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          New Promotion
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '40px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                padding: '12px',
              }}
            />
            <i
              className="fas fa-search position-absolute"
              style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            ></i>
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              padding: '12px',
            }}
          >
            <option>All Types</option>
            <option>Percentage</option>
            <option>Fixed Amount</option>
          </select>
        </div>
      </div>

      {/* Promotions Grid */}
      {filteredPromotions.length === 0 ? (
        <div
          className="text-center p-5"
          style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
            border: '2px dashed #93c5fd',
            borderRadius: '24px',
          }}
        >
          <div className="mb-3">
            <i className="fas fa-plus-circle" style={{ fontSize: '64px', color: '#3b82f6' }}></i>
          </div>
          <h3 style={{ color: '#111827', fontWeight: '600', marginBottom: '8px' }}>
            Create New Promotion
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Start building your next promotional campaign
          </p>
          <button
            onClick={() => navigate('/promotions/create')}
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '8px 24px' }}
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredPromotions.map((promotion) => (
            <div key={promotion._id || promotion.id} className="col-lg-6 mb-4">
              <div
                className="card border-0"
                style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)'
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Card Header */}
                <div
                  className="card-header bg-white border-bottom"
                  style={{ padding: '24px 24px 16px 24px' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i
                            className="fas fa-tag"
                            style={{ color: '#6b7280', fontSize: '16px' }}
                          ></i>
                        </div>
                      </div>
                      <div>
                        <h4
                          className="mb-1"
                          style={{ color: '#111827', fontWeight: '700', fontSize: '20px' }}
                        >
                          {promotion.title}
                        </h4>
                        <p className="mb-0" style={{ color: '#6b7280', fontSize: '14px' }}>
                          {promotion.type}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(promotion)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body" style={{ padding: '24px' }}>
                  {/* Discount and Dates Row */}
                  <div className="row g-3 mb-4">
                    <div className="col-4">
                      <div
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          padding: '16px',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className="fas fa-percent me-2"
                            style={{ fontSize: '12px', color: '#22c55e' }}
                          ></i>
                          <small style={{ color: '#22c55e', fontWeight: '600' }}>Discount</small>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
                          {promotion.discountPercentage || promotion.discountAmount}%
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          padding: '16px',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className="fas fa-calendar me-2"
                            style={{ fontSize: '12px', color: '#3b82f6' }}
                          ></i>
                          <small style={{ color: '#3b82f6', fontWeight: '600' }}>Start Date</small>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>
                          {formatDate(promotion.startDate)}
                        </div>
                      </div>
                    </div>

                    <div className="col-4">
                      <div
                        style={{
                          background: 'rgba(147, 51, 234, 0.1)',
                          padding: '16px',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="d-flex align-items-center mb-1">
                          <i
                            className="fas fa-calendar me-2"
                            style={{ fontSize: '12px', color: '#9333ea' }}
                          ></i>
                          <small style={{ color: '#9333ea', fontWeight: '600' }}>
                            {promotion.endDate ? 'End Date' : 'Hours'}
                          </small>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9333ea' }}>
                          {promotion.endDate
                            ? formatDate(promotion.endDate)
                            : `${promotion.hours} Hours`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  {promotion.productIds && promotion.productIds.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <i
                          className="fas fa-box me-2"
                          style={{ fontSize: '16px', color: '#6b7280' }}
                        ></i>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Products
                        </span>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-sm mb-0" style={{ fontSize: '12px' }}>
                          <thead style={{ backgroundColor: '#1f2937' }}>
                            <tr>
                              <th
                                scope="col"
                                style={{
                                  color: 'white',
                                  padding: '8px 12px',
                                  borderRadius: '8px 0 0 8px',
                                }}
                              >
                                #
                              </th>
                              <th scope="col" style={{ color: 'white', padding: '8px 12px' }}>
                                Product Name
                              </th>
                              <th scope="col" style={{ color: 'white', padding: '8px 12px' }}>
                                Price (SYP)
                              </th>
                              <th
                                scope="col"
                                style={{
                                  color: 'white',
                                  padding: '8px 12px',
                                  borderRadius: '0 8px 8px 0',
                                }}
                              >
                                Category
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {promotion.productIds.slice(0, 3).map((product, productIndex) => (
                              <tr
                                key={product._id || productIndex}
                                style={{ borderBottom: '1px solid #f3f4f6' }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor = '#f9fafb')
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor = 'transparent')
                                }
                              >
                                <td style={{ padding: '8px 12px' }}>{productIndex + 1}</td>
                                <td 
                                  style={{ 
                                    padding: '8px 12px', 
                                    fontWeight: '500',
                                    color: '#0d9488',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => handleProductClick(product)}
                                >
                                  {product.productName || product.name || 'N/A'}
                                </td>
                                <td style={{ padding: '8px 12px' }}>
                                  {product.discountedprice || product.price || 'N/A'}
                                </td>
                                <td style={{ padding: '8px 12px' }}>
                                  {product.category?.category || product.category || 'N/A'}
                                </td>
                              </tr>
                            ))}
                            {promotion.productIds.length > 3 && (
                              <tr style={{ backgroundColor: '#f9fafb' }}>
                                <td
                                  colSpan="4"
                                  className="text-center"
                                  style={{
                                    padding: '8px 12px',
                                    fontSize: '11px',
                                    color: '#6b7280',
                                  }}
                                >
                                  ... and {promotion.productIds.length - 3} more products
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/promotions/update?id=${promotion._id || promotion.id}`)
                      }
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
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promotion._id || promotion.id)}
                      className="flex-fill btn btn-outline-danger"
                      disabled={deleting}
                      style={{
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      <i className="fas fa-trash me-1" style={{ fontSize: '12px' }}></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalRecords > pageSize && (
        <div
          className="d-flex justify-content-between align-items-center mt-4 p-4 bg-white"
          style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Showing {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} promotions
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline-secondary"
              style={{ borderRadius: '12px', padding: '8px 16px' }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-primary"
              style={{ borderRadius: '12px', padding: '8px 16px' }}
            >
              {currentPage}
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
              className="btn btn-outline-secondary"
              style={{ borderRadius: '12px', padding: '8px 16px' }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Promotion