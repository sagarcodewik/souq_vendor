import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { fetchProducts } from '../../../redux/slice/productSlice'
import { updatePromotion } from '../../../redux/slice/promotion'
import PromotionForm from '../../../components/PromotionFrom'
import Loader from '../../../components/loader/loader'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { fetchCategories } from '../../../redux/slice/category'
const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const Update_promotion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get('id')
  const { categories, status: CategoryStatus } = useSelector((state) => state.categories)
  const { list, loading: promotionLoading } = useSelector((state) => state.promotion)
  const { products, status: productStatus } = useSelector((state) => state.products)

  const promotion = list.find((p) => p._id === id)

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, pageSize: 100000 }))
     dispatch(
        fetchCategories({
          page: 1,
          pageSize: 100000,
        }),
      )
  }, [dispatch])

  console.log(promotion, 'promotion=====================', CategoryStatus)

  if (!promotion || productStatus === 'loading') return <Loader />

  return (
    <PromotionForm
      onSubmit={async (formData) => {
        try {
          const { _id, vendorId, isActive, createdAt, updatedAt, __v, isDeleted, ...cleanedData } =
            formData
          if (cleanedData?.scopeType === 'product') {
            delete cleanedData.categoryIds
          }

          if (cleanedData?.scopeType === 'category') {
            delete cleanedData.productIds
          }

          await dispatch(updatePromotion({ id, data: cleanedData })).unwrap()
          navigate('/promotions')
        } catch (err) {
          console.error('Update failed:', err)
        }
      }}
      initialValues={{
        ...promotion,
        productIds: promotion.productIds?.map((p) => (typeof p === 'object' ? p._id : p)),
        startDate: promotion.startDate
          ? moment.utc(promotion.startDate).local().format('YYYY-MM-DD') // ✅ for <input type="date" />
          : '',
        endDate: promotion.endDate
          ? moment.utc(promotion.endDate).local().format('YYYY-MM-DD')
          : '',
      }}
      products={products}
      loading={promotionLoading}
      categories={categories}
    />
  )
}

export default Update_promotion
