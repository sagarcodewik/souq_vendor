import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../../redux/slice/productSlice'
import { fetchCategories } from '../../../redux/slice/category'
import { createPromotion } from '../../../redux/slice/promotion'
import PromotionForm from '../../../components/PromotionFrom'
import Loader from '../../../components/loader/loader'
import { useNavigate } from 'react-router-dom'

const New_promotion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { products, status: productStatus } = useSelector((state) => state.products)
  const { categories, status: categoryStatus } = useSelector((state) => state.categories)
  const { loading: promotionLoading } = useSelector((state) => state.promotion)

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        pageSize: 100000,
        sortKey: 'productName',
        sortDirection: 'asc',
      }),
    )
    dispatch(
      fetchCategories({
        page: 1,
        pageSize: 100000,
      }),
    )
  }, [dispatch])

  const handleCreate = async (formData, { resetForm }) => {
    try {
      if (formData?.scopeType === 'product') {
        delete formData.categoryIds
      }

      if (formData?.scopeType === 'category') {
        delete formData.productIds
      }
      await dispatch(createPromotion(formData))
        .then((result) => {
          resetForm()
          navigate('/promotions')
        })
        .catch((err) => {})
    } catch (error) {
      console.error('Failed to create promotion:', error)
    }
  }

  if (productStatus === 'loading' || categoryStatus === 'loading') return <Loader />

  return (
    <PromotionForm
      onSubmit={handleCreate}
      products={products}
      categories={categories}
      loading={promotionLoading}
    />
  )
}

export default New_promotion
