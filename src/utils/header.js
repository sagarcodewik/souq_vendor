import {
  cilPencil,
  cilTrash,
  cilEyedropper,
  cilCheck,
  cilX,
  cilCheckCircle,
  cilCommentSquare,
  cilZoom,
} from '@coreui/icons'
import { CTooltip } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { CFormSwitch } from '@coreui/react'
import Loader from '../components/loader/loader'
import { CButton } from '@coreui/react'
import { FaEye } from 'react-icons/fa'
const fallback = (value) => (value !== null && value !== undefined ? value : '-')
export const Productheaders = (onToggleAvailability, onToggleCOD) => [
  {
    key: 'productName',
    label: 'Product Name',
    sortable: true,
    render: (row) => {
      // Handle both image locations: direct image keys (0, 1, 2...) or `images` array
      const getFirstImage = () => {
        if (Array.isArray(row.images) && row.images.length > 0) {
          return row.images[0] // case: images is an array
        } else {
          return row.variants[0]?.images[0]
        }

        // handle keys like 0, 1, 2 from object
        const imageKeys = Object.keys(row)
          .filter((key) => !isNaN(Number(key)))
          .sort((a, b) => Number(a) - Number(b))

        return imageKeys.length > 0 ? row[imageKeys[0]] : null
      }

      const imgSrc = getFirstImage()
      const name = fallback(row.productName)

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {imgSrc && (
            <img
              src={imgSrc}
              alt={name}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <span>{name}</span>
        </div>
      )
    },
  },

  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (row) => fallback(row?.category?.category),
  },
  {
    key: 'subCategory',
    label: 'Subcategory',
    sortable: true,
    render: (row) => fallback(row.subCategory),
  },
  {
    key: 'price',
    label: 'Price (SYP)',
    sortable: true,
    render: (row) => fallback(row.price),
  },
  {
    key: 'discount',
    label: 'Discount(%)',
    sortable: true,
    render: (row) => fallback(row.discount),
  },
  {
    key: 'discountedprice',
    label: 'Discounted Price (SYP)',
    sortable: true,
    render: (row) => fallback(row.discountedprice),
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: false,
    render: (row) => `${fallback(row.quantity)} ${fallback(row.unit)}`,
  },
  {
    key: 'stockQuantity',
    label: 'Stock',
    sortable: true,
    render: (row) => fallback(row.stockQuantity),
  },
  {
    key: 'isAvailable',
    label: 'Available',
    sortable: false,
    render: (item) => (
      <CFormSwitch
        id="formSwitchCheckDefault"
        checked={item.isAvailable}
        onChange={() => onToggleAvailability(item)}
      />
    ),
  },
  {
    key: 'isCODAvailable',
    label: 'COD',
    sortable: false,
    render: (item) => (
      <CFormSwitch
        id="formSwitchCheckDefault"
        checked={item.isCODAvailable}
        onChange={() => onToggleCOD(item)}
      />
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (item, onEdit, onDelete, handleReview) => (
      <div className="d-flex align-items-center gap-2">
        <CTooltip content="Edit" placement="top">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(item)}>
            <CIcon icon={cilPencil} size="sm" />
          </button>
        </CTooltip>

        <CTooltip content="Delete" placement="top">
          <button className="btn btn-sm btn-outline-danger me-2" onClick={() => onDelete(item)}>
            <CIcon icon={cilTrash} size="sm" />
          </button>
        </CTooltip>
        <CTooltip content="Review" placement="top">
          <button className="btn btn-sm btn-outline-info" onClick={() => handleReview(item._id)}>
            <CIcon icon={cilCommentSquare} size="sm" />
          </button>
        </CTooltip>
      </div>
    ),
  },
]

// src/constants/tableHeaders.js

export const OrderHeaders = (onMarkReady, loadingId) => [
  { key: '_id', label: 'Order ID', sortable: true, render: (row) => fallback(row._id) },
  {
    key: 'customerId',
    label: 'Customer Email',
    render: (row) => fallback(row.customerId?.email),
  },
  {
    key: 'productId',
    label: 'Product Name',
    render: (row) => fallback(row.productId?.productName),
  },
  { key: 'quantity', label: 'Quantity', sortable: true, render: (row) => fallback(row.quantity) },
  {
    key: 'type',
    label: 'Type',
    render: (row) => (row.type === 1 ? 'Intracity' : row.type === 2 ? 'Intercity' : '—'),
  },
  {
    key: 'grandTotal',
    label: 'Grand Total (SYP)',
    sortable: true,
    render: (row) => fallback(row.grandTotal),
  },
  {
    key: 'deliveryAddress',
    label: 'City',
    render: (row) => fallback(row.deliveryAddress?.city),
  },
  { key: 'status', label: 'Status', sortable: true, render: (row) => fallback(row.status) },
  {
    key: 'createdAt',
    label: 'Placed At',
    sortable: true,
    format: 'date',
  },
  {
    key: 'actions',
    label: 'Action',
    render: (row) => {
      if (row.status === 'confirmed') {
        return loadingId === row._id ? (
          <Loader size={20} />
        ) : (
          <CButton size="sm" color="info" variant="outline" onClick={() => onMarkReady(row._id)}>
            <CIcon icon={cilCheckCircle} className="me-1" />
            Mark as Ready
          </CButton>
        )
      }
      return <span className="text-muted">—</span>
    },
  },
]

export const OrderRequestHeaders = (onStatusChange, loadingOrderId) => [
  { key: '_id', label: 'Order ID', sortable: true, render: (row) => fallback(row._id) },
  {
    key: 'customerId',
    label: 'Customer Email',
    render: (row) => fallback(row.customerId?.email),
  },
  {
    key: 'productId',
    label: 'Product Name',
    render: (row) => fallback(row.productId?.productName),
  },
  { key: 'quantity', label: 'Quantity', sortable: true, render: (row) => fallback(row.quantity) },
  {
    key: 'subTotal',
    label: 'Subtotal (SYP)',
    sortable: true,
    render: (row) => fallback(row.subTotal),
  },
  {
    key: 'shippingFee',
    label: 'Shipping Fee (SYP)',
    sortable: true,
    render: (row) => fallback(row.shippingFee),
  },
  {
    key: 'grandTotal',
    label: 'Grand Total (SYP)',
    sortable: true,
    render: (row) => fallback(row.grandTotal),
  },
  {
    key: 'deliveryAddress',
    label: 'City',
    render: (row) => fallback(row.deliveryAddress?.city),
  },
  {
    key: 'type',
    label: 'Type',
    render: (row) => (row.type === 1 ? 'Intracity' : row.type === 2 ? 'Intercity' : '—'),
  },
  { key: 'status', label: 'Status', sortable: true, render: (row) => fallback(row.status) },
  {
    key: 'paymentStatus',
    label: 'Payment',
    sortable: true,
    render: (row) => fallback(row.paymentStatus),
  },
  {
    key: 'createdAt',
    label: 'Placed At',
    sortable: true,
    format: 'date',
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) =>
      loadingOrderId === row._id ? (
        <Loader />
      ) : (
        <div className="d-flex justify-content-between items-center gap-3">
          <CButton
            size="sm"
            color="success"
            variant="outline"
            onClick={() => onStatusChange(row._id, 'confirmed')}
          >
            <CIcon icon={cilCheck} />
          </CButton>
          <CButton
            size="sm"
            color="danger"
            variant="outline"
            onClick={() => onStatusChange(row._id, 'cancelled')}
          >
            <CIcon icon={cilX} />
          </CButton>
        </div>
      ),
  },
]

export const ReturnedOrderHeaders = (loadingOrderId) => [
  { key: '_id', label: 'Order ID', sortable: true, render: (row) => fallback(row._id) },
  {
    key: 'customerId',
    label: 'Customer Email',
    render: (row) => fallback(row.customerId?.email),
  },
  {
    key: 'productId',
    label: 'Product Name',
    render: (row) => fallback(row.productId?.productName),
  },
  { key: 'quantity', label: 'Quantity', sortable: true, render: (row) => fallback(row.quantity) },
  {
    key: 'subTotal',
    label: 'Subtotal (SYP)',
    sortable: true,
    render: (row) => fallback(row.subTotal),
  },
  {
    key: 'shippingFee',
    label: 'Shipping Fee (SYP)',
    sortable: true,
    render: (row) => fallback(row.shippingFee),
  },
  {
    key: 'grandTotal',
    label: 'Grand Total (SYP)',
    sortable: true,
    render: (row) => fallback(row.grandTotal),
  },
  {
    key: 'deliveryAddress',
    label: 'City',
    render: (row) => fallback(row.deliveryAddress?.city),
  },
  {
    key: 'type',
    label: 'Type',
    render: (row) => (row.type === 1 ? 'Intracity' : row.type === 2 ? 'Intercity' : '—'),
  },
  { key: 'status', label: 'Status', sortable: true, render: (row) => fallback(row.status) },
  {
    key: 'returnReason',
    label: 'Return Reason',
    sortable: false,
    render: (row) => fallback(row.returnReason),
  },
  {
    key: 'paymentStatus',
    label: 'Payment',
    sortable: true,
    render: (row) => fallback(row.paymentStatus),
  },
  {
    key: 'createdAt',
    label: 'Placed At',
    sortable: true,
    format: 'date',
  },
]

export const PromotionHeaders = (navigate, handleDelete, handleView) => [
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    render: (row) => fallback(row.title),
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (row) => fallback(row.description),
  },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (row) => fallback(row.type?.toUpperCase()),
  },
  {
    key: 'promotionCode',
    label: 'promotionCode',
    sortable: true,
    render: (row) => fallback(row.promotionCode),
  },
  {
    key: 'isDeleted',
    label: 'Deleted',
    sortable: true,
    render: (row) => (row.isDeleted ? 'Yes' : 'No'),
  },
  {
    key: 'startDate',
    label: 'Start Date',
    sortable: true,
    format: 'date',
  },
  {
    key: 'endDate',
    label: 'End Date',
    sortable: true,
    format: 'date',
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    format: 'date',
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <>
        <CButton
          onClick={() => handleView(row)}
          size="sm"
          variant="outline"
          className="me-2"
          color="info"
        >
          <FaEye />
        </CButton>
        <CButton
          onClick={() => navigate(`/promotions/update?id=${row._id}`)}
          size="sm"
          variant="outline"
          className="me-2"
        >
          <CIcon icon={cilPencil} size="sm" />
        </CButton>
        <CButton onClick={() => handleDelete(row._id)} size="sm" variant="outline" color="danger">
          <CIcon icon={cilTrash} size="sm" />
        </CButton>
      </>
    ),
  },
]

export const DashboardProductheaders = () => [
  {
    key: 'productName',
    label: 'Product Name',
    sortable: true,
    render: (row) => {
      // Handle both image locations: direct image keys (0, 1, 2...) or `images` array
      const getFirstImage = () => {
        if (Array.isArray(row.images) && row.images.length > 0) {
          return row.images[0] // case: images is an array
        } else {
          return row.variants[0]?.images[0]
        }

        // handle keys like 0, 1, 2 from object
        const imageKeys = Object.keys(row)
          .filter((key) => !isNaN(Number(key)))
          .sort((a, b) => Number(a) - Number(b))

        return imageKeys.length > 0 ? row[imageKeys[0]] : null
      }

      const imgSrc = getFirstImage()
      const name = fallback(row.productName)

      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {imgSrc && (
            <img
              src={imgSrc}
              alt={name}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <span>{name}</span>
        </div>
      )
    },
  },

  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (row) => fallback(row?.category?.category),
  },
  {
    key: 'subCategory',
    label: 'Subcategory',
    sortable: true,
    render: (row) => fallback(row.subCategory),
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: false,
    render: (row) => `${fallback(row.quantity)} ${fallback(row.unit)}`,
  },
  {
    key: 'stockQuantity',
    label: 'Stock',
    sortable: true,
    render: (row) => fallback(row.stockQuantity),
  },
]
