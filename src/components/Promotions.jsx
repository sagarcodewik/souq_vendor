// src/components/Promotions/PromotionDisplayUI.jsx
import React from 'react'
import { Edit, Trash2, Tag, Gift, Zap, Calendar, Percent, Package } from 'lucide-react'
import { CButton } from '@coreui/react'

const Promotions = ({ promotions, onEdit, onDelete }) => {
  const getPromotionIcon = (type) => {
    switch (type) {
      case 'promotion':
        return Tag
      case 'bundle':
        return Gift
      case 'flash sale':
        return Zap
      default:
        return Tag
    }
  }

  const getPromotionBadgeClass = (type) => {
    switch (type) {
      case 'promotion':
        return 'badge bg-primary'
      case 'bundle':
        return 'badge bg-success'
      case 'flash sale':
        return 'badge bg-warning text-dark'
      default:
        return 'badge bg-secondary'
    }
  }

  const formatCurrency = (amount) => `${amount} SYP`

  if (!Array.isArray(promotions) || promotions.length === 0) {
    return <div className="text-center text-muted p-5">No promotions found</div>
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row">
        {promotions.map((promotion) => {
          const IconComponent = getPromotionIcon(promotion.type)

          return (
            <div key={promotion._id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                {/* Card Header */}
                <div className="card-header bg-light border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="bg-white p-2 rounded me-3 shadow-sm">
                        <IconComponent size={24} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="card-title mb-1">{promotion.title}</h4>
                        <p className="text-muted mb-0 small">{promotion.description}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <span className={`${getPromotionBadgeClass(promotion.type)} text-capitalize`}>
                        {promotion.type}
                      </span>
                      <span className={`badge ${promotion.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="row mb-4">
                    {/* Discount */}
                    <div className="col-6 mb-3">
                      <div className="bg-success bg-opacity-10 p-3 rounded h-100">
                        <div className="d-flex align-items-center mb-2">
                          <Percent size={16} className="text-success me-2" />
                          <small className="fw-medium text-success">Discount</small>
                        </div>
                        <div className="h3 fw-bold text-success mb-0">
                          {promotion.discountPercentage}%
                        </div>
                      </div>
                    </div>

                    {/* Promotion Code */}
                    {promotion.type === 'promotion' && (
                      <div className="col-6 mb-3">
                        <div className="bg-secondary bg-opacity-10 p-3 rounded h-100">
                          <div className="d-flex align-items-center mb-2">
                            <Tag size={16} className="text-primary me-2" />
                            <small className="fw-medium text-primary">Promotion Code</small>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <code className="text-dark">{promotion.promotionCode}</code>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Start Date */}
                    <div className="col-6 mb-3">
                      <div className="bg-secondary bg-opacity-10 p-3 rounded h-100">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-secondary me-2" />
                          <small className="fw-medium text-secondary">Start Date</small>
                        </div>
                        <div className="fw-semibold">
                          {new Date(promotion.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="col-6 mb-3">
                      <div className="bg-secondary bg-opacity-10 p-3 rounded h-100">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-secondary me-2" />
                          <small className="fw-medium text-secondary">End Date</small>
                        </div>
                        <div className="fw-semibold">
                          {new Date(promotion.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <Package size={20} className="text-secondary me-2" />
                      <h5 className="mb-0">Products</h5>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price (SYP)</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {promotion.productIds.map((product, index) => (
                            <tr key={product.id || product._id}>
                              <td>{index + 1}</td>
                              <td className="fw-medium">{product.productName}</td>
                              <td>{formatCurrency(product.discountedprice)}</td>
                              <td>{product.category?.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-end gap-2">
                    <CButton
                      onClick={() => onEdit(promotion._id)}
                      color="primary"
                      className="btn btn-sm d-flex align-items-center"
                    >
                      <Edit size={16} className="me-1" /> Edit
                    </CButton>
                    <CButton
                      onClick={() => onDelete(promotion._id)}
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                    >
                      <Trash2 size={16} className="me-1" /> Delete
                    </CButton>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Promotions
