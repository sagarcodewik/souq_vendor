// src/pages/products/EditProduct.jsx
import { useParams, useLocation } from 'react-router-dom'
import ProductForm from '../../../components/ProductForm'

const EditProduct = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const productId = searchParams.get('id')
  return <ProductForm isEditMode productId={productId} />
}

export default EditProduct
