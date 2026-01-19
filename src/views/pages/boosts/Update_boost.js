import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/loader'
import BoostForm from '../../../components/BoostForm'
import { fetchProducts } from '../../../redux/slice/productSlice'
import { fetchCategories } from '../../../redux/slice/category'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { updatePromotion } from '../../../redux/slice/promotion'
import { fetchBoosts, updateBoost } from '../../../redux/slice/boosts'
const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const New_boost = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get('id')
  const { products, status: productStatus } = useSelector((state) => state.products)
  const { categories, status: categoryStatus } = useSelector((state) => state.categories)
  const { loading, list } = useSelector((state) => state.boosts)

  const boost = list?.find((p) => p._id === id)

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        pageSize: 100000,
      }),
    )
    dispatch(
      fetchCategories({
        page: 1,
        pageSize: 100000,
      }),
    )
    dispatch(
      fetchBoosts({
        page: 1,
        pageSize: 100000,
      }),
    )
  }, [dispatch])

  if (!boost || productStatus === 'loading' || categoryStatus === 'loading') {
    return <Loader />
  }

  const normalizeBoostForForm = (boost) => {
    if (!boost) return {}

    return {
      boostType: boost.boost_type ?? '',
      scopeType: boost.scope_type ?? 'product',

      productIds:
        boost.scope_type === 'product'
          ? (boost.scope_ids?.map((id) => (typeof id === 'object' ? id._id : id)) ?? [])
          : [],

      categoryIds:
        boost.scope_type === 'category'
          ? (boost.scope_ids?.map((id) => (typeof id === 'object' ? id._id : id)) ?? [])
          : [],

      duration: boost.duration?.value ?? 7,

      startDate: boost.start_date ? moment.utc(boost.start_date).format('YYYY-MM-DD') : '',
    }
  }

  return (
    <BoostForm
      onSubmit={async (formData) => {
        try {
          const { _id, vendorId, isActive, createdAt, updatedAt, __v, isDeleted, ...cleanedData } =
            formData

          await dispatch(updateBoost({ id, data: cleanedData })).unwrap()
          navigate('/boosts')
        } catch (err) {
          console.error('Update failed:', err)
        }
      }}
      initialValues={normalizeBoostForForm(boost)}
      products={products}
      categories={categories}
      loading={loading}
    />
  )
}

export default New_boost
