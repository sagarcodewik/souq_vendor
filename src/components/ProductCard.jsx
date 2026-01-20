import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  CTooltip,
  CFormSwitch,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilCommentSquare, cilStar } from '@coreui/icons'
import styles from './productCard.module.scss'

const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onReview,
  onToggleAvailability,
  onToggleCOD,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  const images = React.useMemo(() => {
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.variants?.[0]?.images || []
  }, [product.images, product.variants])

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images])

  // Reset modal image index when modal opens
  useEffect(() => {
    if (visible) {
      setModalImageIndex(0)
    }
  }, [visible])

  return (
    <>
      <CCard className={styles.productCard}>
        <div
          style={{
            height: '230px',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={() => setVisible(true)}
        >
          <div
            style={{
              display: 'flex',
              width: `${images.length * 100}%`,
              transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product-${idx}`}
                style={{
                  width: `${100 / images.length}%`,
                  height: '230px',
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>

          {/* Hover overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            className="hover-overlay"
          >
            Click to View Details
          </div>
        </div>

        <CCardBody>
          <CCardTitle className="fw-bold text-truncate">{product.productName}</CCardTitle>
          <CCardText className="text-muted mb-1">{product.category?.category}</CCardText>

          <CCardText className="mb-1">
            <strong>Price:</strong> {product.price} SYP
          </CCardText>
          <CCardText className="mb-1">
            <strong>Discount:</strong> {product.discount}% →{' '}
            <strong>{product.discountedprice} SYP</strong>
          </CCardText>
          <CCardText className="mb-1">
            <strong>Stock:</strong> {product.stockQuantity} {product.unit}
          </CCardText>

          <div className="d-flex justify-content-between align-items-center my-2">
            <div>
              <label className="me-1">Available</label>
              <CFormSwitch
                size="sm"
                checked={product.isAvailable}
                onChange={() => onToggleAvailability(product)}
              />
            </div>
            <div>
              <label className="me-1">COD</label>
              <CFormSwitch
                size="sm"
                checked={product.isCODAvailable}
                onChange={() => onToggleCOD(product)}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
             {Number(product.ratings?.overall) > 0 && (
                  <div className={styles.ratingBadge}>
                    <CIcon
                      icon={cilStar}
                      style={{
                        color: '#ffc107',
                        fontSize: '16px',
                      }}
                    />
                    <span>{product.ratings.overall}</span>
                  </div>
                )}
            {/* <div className={styles.ratingBadge}>
              <CIcon
                icon={cilStar}
                style={{
                  color: '#ffc107',
                  fontSize: '16px',
                }}
              />
              <span>{product.ratings?.overall || '0'}</span>
            </div> */}
            {/* <CTooltip content="View">
              <CButton size="sm" color="primary" onClick={() => setVisible(true)}>
                <CIcon icon={cilZoom} />
              </CButton>
            </CTooltip> */}
            <CTooltip content="Edit">
              <CButton size="sm" color="primary" onClick={() => onEdit(product)}>
                <CIcon icon={cilPencil} />
              </CButton>
            </CTooltip>
            <CTooltip content="Review">
              <CButton size="sm" color="primary" onClick={() => onReview(product._id)}>
                <CIcon icon={cilCommentSquare} />
              </CButton>
            </CTooltip>
            <CTooltip content="Delete">
              <CButton size="sm" color="primary" onClick={() => onDelete(product)}>
                <CIcon icon={cilTrash} />
              </CButton>
            </CTooltip>
          </div>
        </CCardBody>
      </CCard>

      {/* 🔍 Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader onClose={() => setVisible(false)}>
          <div className="d-flex gap-2 align-items-center w-100">
            <CModalTitle className="mb-0">{product.productName}</CModalTitle>
            <CBadge color="info"> {product.productType === '1' ? '15 Min' : 'Market Place'}</CBadge>
          </div>
        </CModalHeader>
        <CModalBody>
          {/* Carousel Section */}
          <div
            style={{ height: '260px', overflow: 'hidden', position: 'relative' }}
            className="mb-3 rounded"
          >
            <div
              style={{
                display: 'flex',
                width: `${images.length * 100}%`,
                transform: `translateX(-${modalImageIndex * (100 / images.length)}%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product-${idx}`}
                  style={{
                    width: `${100 / images.length}%`,
                    height: '260px',
                    objectFit: 'cover',
                  }}
                />
              ))}
            </div>

            {/* Arrow Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  className="position-absolute top-50 start-0 translate-middle-y btn btn-light btn-sm shadow"
                  style={{ zIndex: 2 }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setModalImageIndex((prev) => (prev + 1) % images.length)}
                  className="position-absolute top-50 end-0 translate-middle-y btn btn-light btn-sm shadow"
                  style={{ zIndex: 2 }}
                >
                  ›
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="position-absolute bottom-2 start-50 translate-middle-x d-flex gap-2">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setModalImageIndex(idx)}
                    className={`rounded-circle ${idx === modalImageIndex ? 'bg-dark' : 'bg-light'}`}
                    style={{
                      width: '10px',
                      height: '10px',
                      cursor: 'pointer',
                      border: '1px solid #ccc',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded-end">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="mb-3">
            <p> {product.description || 'No description available.'}</p>

            {/* Highlights */}
            {product.highlight && (
              <div className="mb-3">
                <strong>Highlights:</strong>
                <div
                  className="ps-3"
                  style={{
                    color: '#555',
                    fontSize: '0.95rem',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: product.highlight.replace(/<li>/g, '<li style="margin-bottom:4px;">✓ '),
                  }}
                />
              </div>
            )}

            {/* Overview */}
            {product.overview && (
              <div className="mb-3">
                <strong>Overview:</strong>
                <div
                  className="text-secondary"
                  dangerouslySetInnerHTML={{
                    __html: product.overview,
                  }}
                />
              </div>
            )}

            {/* Ratings */}
            <p className="mb-2">
              <strong>Rating:</strong>{' '}
              {product.ratings?.overall ? (
                <>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`me-1 ${i < Math.floor(product.ratings.overall) ? 'text-warning' : 'text-muted'}`}
                    >
                      ★
                    </span>
                  ))}
                  {product.ratings.overall.toFixed(1)}
                </>
              ) : (
                'N/A'
              )}
            </p>

            {/* Meta Info Grid */}
            <div className="row mb-3">
              <div className="col-sm-6">
                <strong>Category:</strong> {product.category?.category || 'N/A'}
              </div>
              <div className="col-sm-6">
                <strong>Sub Category:</strong> {product.subCategory || 'N/A'}
              </div>
              <div className="col-sm-6">
                <strong>Quantity:</strong> {product.quantity} {product.unit}
              </div>
              <div className="col-sm-6">
                <strong>Stock:</strong> {product.stockQuantity}
              </div>
              {product.dimensions && (
                <div className="col-12 mt-2">
                  <strong>Dimensions:</strong>{' '}
                  {`${product.dimensions.length || 0} × ${product.dimensions.width || 0} × ${product.dimensions.height || 0} ${product.dimensions.unit || ''}`}
                </div>
              )}
            </div>

            {/* Price & Discount */}
            <div className="mb-3">
              <strong>Price:</strong>{' '}
              <span className="text-danger fw-bold">{product.discountedprice} SYP</span>{' '}
              {product.discount > 0 && (
                <span className="text-muted text-decoration-line-through">{product.price} SYP</span>
              )}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mb-3">
                <strong>Tags:</strong>{' '}
                {product.tags.map((tag, i) => (
                  <span key={i} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Availability & COD */}
            <div className="d-flex flex-wrap gap-2">
              <span className={`badge ${product.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                {product.isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
              </span>
              <span
                className={`badge ${product.isCODAvailable ? 'bg-info text-dark' : 'bg-secondary'}`}
              >
                {product.isCODAvailable ? 'COD Available' : 'COD Not Available'}
              </span>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ProductCard
