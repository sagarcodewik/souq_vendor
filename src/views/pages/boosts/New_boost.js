import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/loader/loader'
import BoostForm from '../../../components/BoostForm'
import { fetchProducts } from '../../../redux/slice/productSlice'
import { fetchCategories } from '../../../redux/slice/category'
import { createBoost } from '../../../redux/slice/boosts'

const New_boost = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { products, status: productStatus } = useSelector(
    (state) => state.products,
  )
  const { categories, status: categoryStatus } = useSelector(
    (state) => state.categories,
  )
  const { loading } = useSelector((state) => state.boosts)

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
  }, [dispatch])

  const handleCreate = async (payload) => {
    try {
      await dispatch(createBoost(payload)).unwrap()
      navigate('/boosts')
    } catch (err) {
      console.error(err)
    }
  }

  if (productStatus === 'loading' || categoryStatus === 'loading') {
    return <Loader />
  }

  return (
    <BoostForm
      onSubmit={handleCreate}
      products={products}
      categories={categories}
      loading={loading}
    />
  )
}

export default New_boost
