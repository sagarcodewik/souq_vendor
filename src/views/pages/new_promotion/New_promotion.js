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
      const result = await dispatch(createPromotion(formData)).unwrap()

      // Only runs if the promise is fulfilled
      resetForm() // ✅ Reset the form
      navigate('/promotions') // ✅ Navigate to promotions list
    } catch (error) {
      console.error('Failed to create promotion:', error)
      // Optionally: show toast or error feedback here
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
