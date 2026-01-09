import React, { useEffect, useState, useCallback } from 'react'
import DataTable from '../../../components/datatable/datatable'
import ProductCard from '../../../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
  updateProductStatus,
} from '../../../redux/slice/productSlice'
import { useNavigate } from 'react-router-dom'
import { Productheaders } from '../../../utils/header'
import { fetchCategories } from '../../../redux/slice/category'
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal'
import Loader from '../../../components/loader/loader'
import styles from './product.module.scss'
import { CPagination, CPaginationItem } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { products, status, totalRecords, deleteStatus } = useSelector((state) => state.products)
  const { categories } = useSelector((state) => state.categories)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortKey, setSortKey] = useState('productName')
  const [sortDirection, setSortDirection] = useState('asc')

  // 🔍 Search & Filter
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('') // 👈 debounce state
  const [selectedCategory, setSelectedCategory] = useState('')

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  // 🔥 Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // reset to first page when search changes
    }, 500) // 500ms debounce delay

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  // Load products
  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        pageSize,
        sortKey,
        sortDirection,
        search: debouncedSearch, // 👈 use debounced search here
        categoryName: selectedCategory,
      }),
    )
  }, [dispatch, currentPage, pageSize, sortKey, sortDirection, debouncedSearch, selectedCategory])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSort = (key, direction) => {
    setSortKey(key)
    setSortDirection(direction === 'asc' ? 'asc' : 'desc')
    setCurrentPage(1)
  }

  const handleReview = (id) => {
    navigate(`/products/review?id=${id}`)
  }
  const handleEditItem = (item) => {
    navigate(`/products/edit?id=${item._id}`)
  }

  const handleDeleteItem = (item) => {
    setSelectedProduct(item)
    setDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct._id)).unwrap()
      setDeleteModalVisible(false)
    }
  }

  const handleToggleAvailability = async (item) => {
    await dispatch(
      updateProductStatus({
        productId: item._id,
        status: !item.isAvailable,
        statesName: 'isAvailable',
      }),
    ).unwrap()
    loadProducts()
  }

  const handleToggleCOD = async (item) => {
    await dispatch(
      updateProductStatus({
        productId: item._id,
        status: !item.isCODAvailable,
        statesName: 'isCODAvailable',
      }),
    ).unwrap()
    loadProducts()
  }

  const headers = Productheaders(handleToggleAvailability, handleToggleCOD).map((header) => {
    if (header.key === 'actions') {
      return {
        ...header,
        render: (item) => header.render(item, handleEditItem, handleDeleteItem, handleReview),
      }
    }
    return header
  })

  return (
    <div>
      <div className="card-body p-4">
        {/* Top bar with search + filter */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-xl font-semibold mb-0">Product List</h4>
          <div className="d-flex gap-2">
            {/* 🔍 Search box */}
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ maxWidth: '200px' }}
            />

            {/* 🎯 Category Filter */}
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              style={{ maxWidth: '200px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                // <option key={cat._id} value={cat.category}>
                <option key={cat._id} value={cat._id}>
                  {cat.category}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={() => navigate('/products/new-product')}>
              New Product
            </button>
          </div>
        </div>

        {status === 'loading' ? (
          <Loader />
        ) : (
          <>
            {products.length === 0 && status !== 'loading' && (
              <div className={styles.noDataMessage}>No products found.</div>
            )}
            {products.length > 0 && (
              <div className="row g-3">
                {products.map((product) => (
                  <div key={product._id} className="col-sm-6 col-md-4 col-lg-4">
                    <ProductCard
                      product={product}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      onReview={handleReview}
                      onToggleAvailability={handleToggleAvailability}
                      onToggleCOD={handleToggleCOD}
                    />
                  </div>
                ))}
              </div>
            )}
            {products.length > 0 && Math.ceil(totalRecords / pageSize) > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <p className="text-muted mb-0">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, totalRecords)} to{' '}
                  {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} products
                </p>
                <CPagination align="center">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <CIcon icon={cilChevronLeft} />
                  </CPaginationItem>

                  {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
                    <CPaginationItem
                      key={i + 1}
                      active={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}

                  <CPaginationItem
                    disabled={currentPage === Math.ceil(totalRecords / pageSize)}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <CIcon icon={cilChevronRight} />
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🔴 Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Product"
        body={`Are you sure you want to delete the product "${selectedProduct?.productName}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleteStatus === 'loading'}
      />
    </div>
  )
}

export default Products
