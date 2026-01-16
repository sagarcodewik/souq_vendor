import React, { useState, useEffect } from 'react'

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0)

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0)
  }, [product])

  if (!isOpen || !product) return null

  // Get all images from variants or main images
  const allImages =
    product.variants?.length > 0
      ? product.variants.flatMap((v) => v.images || [])
      : product.images || []

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            zIndex: 10,
            borderRadius: '24px 24px 0 0',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            Product Details
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.color = '#111827'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <div className="row">
            {/* Image Gallery */}
            <div className="col-md-6">
              {allImages.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={allImages[selectedImage]}
                      alt={product.productName}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {allImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border:
                              selectedImage === idx ? '3px solid #0d9488' : '2px solid #e5e7eb',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={img}
                            alt={`${product.productName} ${idx + 1}`}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <i
                    className="fas fa-image"
                    style={{ fontSize: '64px', color: '#d1d5db', marginBottom: '16px' }}
                  ></i>
                  <p style={{ color: '#9ca3af', margin: 0 }}>No images available</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="col-md-6">
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '16px',
                }}
              >
                {product.productName}
              </h2>

              {/* Category Badge */}
              <div style={{ marginBottom: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {product.category?.category || 'N/A'}
                </span>
                {product.subCategory && (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f3e8ff',
                      color: '#6b21a8',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginLeft: '8px',
                    }}
                  >
                    {product.subCategory}
                  </span>
                )}
              </div>

              {/* Pricing */}
              <div
                style={{
                  marginBottom: '24px',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>
                    {product.discountedprice} SYP
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span
                        style={{
                          fontSize: '20px',
                          color: '#9ca3af',
                          textDecoration: 'line-through',
                        }}
                      >
                        {product.price} SYP
                      </span>
                      <span
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        -{product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <i className="fas fa-box me-2"></i>
                  Stock: <strong>{product.stockQuantity}</strong> {product.unit}(s)
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Description
                </h4>
                <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {product.description}
                </p>
              </div>

              {/* Color Variants */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px',
                    }}
                  >
                    Available Colors
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {product.variants.map((variant, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                        }}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: variant.colorCode,
                            border: '2px solid #e5e7eb',
                          }}
                        ></div>
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                          {variant.colorName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info Grid */}
              <div className="row g-3">
                <div className="col-6">
                  <div
                    style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px' }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#3b82f6',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Quantity per Unit
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e40af' }}>
                      {product.quantity} {product.unit}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#22c55e',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Rating
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
                      {product.ratings?.overall || 0}{' '}
                      <i className="fas fa-star" style={{ fontSize: '14px' }}></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Badges */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                {product.isAvailable && (
                  <span
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    <i className="fas fa-check-circle me-2"></i>Available
                  </span>
                )}
                {product.isCODAvailable && (
                  <span
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    <i className="fas fa-money-bill-wave me-2"></i>COD Available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsModal
