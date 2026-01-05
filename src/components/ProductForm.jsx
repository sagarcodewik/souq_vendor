import React, { use, useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CRow,
  CFormSelect,
  CBadge,
  CAlert,
  CTabs,
  CTabList,
  CTab,
  CTabContent,
  CTabPanel,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ProductRegistervalidationSchema } from '../utils/validations'
import { createProduct, updateProduct, fetchAllCategories } from '../redux/slice/productSlice'
import TipTapEditor from './TipTapEditor'
import styles from './productFrom.module.scss'
import { toast } from 'react-toastify'
import {
  categories,
  PREDEFINED_COLORS,
  DEFAULT_PRODUCT_VALUES,
  UNITS,
  CLOTHING_SIZES,
  requiresSize,
  requiresQuantityUnit,
} from '../utils/constants'

/**
 * ---------------------------------------------------------------------------
 * ProductForm component with Size Checkboxes for Clothes Category
 * ---------------------------------------------------------------------------
 */
const ProductForm = ({ isEditMode = false, productId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  /** State Management ---------------------------------------------------- */
  const [selectedColors, setSelectedColors] = useState([])
  const [customColorName, setCustomColorName] = useState('')
  const [customColorCode, setCustomColorCode] = useState('#000000')
  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [generalImages, setGeneralImages] = useState([])
  const [generalImagePreviews, setGeneralImagePreviews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tagInput, setTagInput] = useState('')
  const generalImageInputRef = useRef(null)

  const [initialValues, setInitialValues] = useState(DEFAULT_PRODUCT_VALUES)
  const imageInputRefs = useRef({})
  const { categories } = useSelector((state) => state.products) // or categorySlice if you separated it

  /** Size Checkbox Management -------------------------------------------- */
  const handleSizeChange = (sizeValue, isChecked, setFieldValue, currentSizes) => {
    let updatedSizes
    if (isChecked) {
      // Add size if checked
      updatedSizes = [...currentSizes, sizeValue]
    } else {
      // Remove size if unchecked
      updatedSizes = currentSizes.filter((size) => size !== sizeValue)
    }
    setFieldValue('sizes', updatedSizes)
  }

  /** Color and Image Management ------------------------------------------ */

  // Initialize image input refs for each color
  const initializeImageRef = (colorId) => {
    if (!imageInputRefs.current[colorId]) {
      imageInputRefs.current[colorId] = React.createRef()
    }
  }

  // Add predefined color
  const addPredefinedColor = (colorOption) => {
    if (selectedColors.find((c) => c.colorCode === colorOption.code)) {
      toast.warning('This color is already added!')
      return
    }

    const newColor = {
      id: Date.now() + Math.random(),
      colorName: colorOption.name,
      colorCode: colorOption.code,
      images: [],
      imagePreviews: [],
    }

    setSelectedColors((prev) => [...prev, newColor])
    setTimeout(() => initializeImageRef(newColor.id), 0)
  }

  // Add custom color
  const addCustomColor = () => {
    if (!customColorName.trim()) {
      toast.error('Please enter a color name')
      return
    }

    if (selectedColors.find((c) => c.colorCode === customColorCode)) {
      toast.warning('This color is already added!')
      return
    }

    const newColor = {
      id: Date.now() + Math.random(),
      colorName: customColorName.trim(),
      colorCode: customColorCode,
      images: [],
      imagePreviews: [],
    }

    setSelectedColors((prev) => [...prev, newColor])
    setCustomColorName('')
    setCustomColorCode('#000000')
    setTimeout(() => initializeImageRef(newColor.id), 0)
  }

  // Remove color
  const removeColor = (colorId) => {
    setSelectedColors((prev) => prev.filter((c) => c.id !== colorId))
    delete imageInputRefs.current[colorId]
  }
  const isSubmitDisabled = (isSubmitting) => {
    if (isSubmitting) return true

    const requiresColorImages = selectedCategory?.color === true

    if (requiresColorImages) {
      // For color-based categories: check if colors exist and each has images
      return (
        selectedColors.length === 0 || selectedColors.some((color) => color.images.length === 0)
      )
    } else {
      // For general image categories: check if general images exist
      return generalImages.length === 0
    }
  }
  // Handle image upload for specific color
  const handleColorImageChange = (colorId, e) => {
    const newFiles = Array.from(e.target.files)

    setSelectedColors((prev) =>
      prev.map((color) => {
        if (color.id === colorId) {
          const existingFiles = color.images || []
          const existingPreviews = color.imagePreviews || []

          const totalFiles = existingFiles.length + newFiles.length
          if (totalFiles > 5) {
            toast.error('Maximum 5 images allowed per color')
            return color
          }

          const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

          return {
            ...color,
            images: [...existingFiles, ...newFiles],
            imagePreviews: [...existingPreviews, ...newPreviews],
          }
        }
        return color
      }),
    )
  }

  // Remove image from color
  const removeImageFromColor = async (colorId, imageIndex) => {
    console.log('selectedColors:', selectedColors)

    // Create a deep copy of selectedColors to avoid async state issues
    const updatedColors = await Promise.all(
      selectedColors.map(async (color) => {
        if (color.id === colorId) {
          const newImages = color.images.filter((_, i) => i !== imageIndex)
          const newPreviews = color.imagePreviews.filter((_, i) => i !== imageIndex)

          const inputRef = imageInputRefs.current[colorId]?.current

          if (inputRef) {
            const dt = new DataTransfer()

            const files = await Promise.all(
              newImages.map(async (img) => {
                if (img instanceof File) return img
                if (typeof img === 'string') {
                  try {
                    const res = await fetch(img)
                    const blob = await res.blob()
                    const fileName = img.split('/').pop().split('?')[0] || 'image.jpg'
                    return new File([blob], fileName, { type: blob.type })
                  } catch (err) {
                    console.error('Error fetching image from S3 URL:', img, err)
                    return null
                  }
                }
                return null
              }),
            )

            files.filter(Boolean).forEach((file) => dt.items.add(file))
            inputRef.files = dt.files
          }

          return {
            ...color,
            images: newImages,
            imagePreviews: newPreviews,
          }
        }

        return color
      }),
    )

    setSelectedColors(updatedColors)
  }

  /** Category and Size Management ---------------------------------------- */
  const handleGeneralImagesChange = (e) => {
    const newFiles = Array.from(e.target.files)

    const totalFiles = generalImages.length + newFiles.length
    if (totalFiles > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    console.log('generalImages:', generalImages)
    setGeneralImages((prev) => [...prev, ...newFiles])
    setGeneralImagePreviews((prev) => [...prev, ...newPreviews])
    console.log('generalImages:', generalImages)
    // Reset input so same file can be reselected later
    // if (generalImageInputRef.current) {
    //   generalImageInputRef.current.value = null
    // }
  }

  const removeGeneralImage = (index) => {
    const updatedFiles = [...generalImages]
    const updatedPreviews = [...generalImagePreviews]

    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setGeneralImages(updatedFiles)
    setGeneralImagePreviews(updatedPreviews)

    // 🔁 Reset file input if no files left (or force re-selection)
    if (updatedFiles.length === 0 && generalImageInputRef.current) {
      generalImageInputRef.current.value = null
    }
  }

  // Handle category change with size logic
  const handleCategoryChange = (categoryId, setFieldValue) => {
    // Update category ID
    setFieldValue('category', categoryId)

    // Clear dependent fields when category changes
    setFieldValue('subCategory', '')
    setFieldValue('sizes', [])

    // Find selected category object by ID
    const selectedCategory = categories.find((cat) => cat._id === categoryId)
    setSelectedCategory(selectedCategory)
    // If the category is 'Clothes', apply default values
    if (selectedCategory?.category === 'Clothes') {
      setFieldValue('quantity', '1')
      setFieldValue('unit', 'piece')
    } else {
      setFieldValue('quantity', '')
      setFieldValue('unit', '')
    }

    // Set available subcategories
    if (selectedCategory?.subCategory?.length) {
      setAvailableSubcategories(selectedCategory.subCategory)
    } else {
      setAvailableSubcategories([])
    }
  }

  /** Edit Mode: Load Product Data ---------------------------------------- */
  const allProducts = useSelector((state) => state.products.products)

  useEffect(() => {
    if (!isEditMode || !productId || !allProducts.length || !categories.length) return

    const productToEdit = allProducts.find((p) => p._id === productId)
    if (!productToEdit) return

    const categoryId =
      typeof productToEdit.category === 'object'
        ? productToEdit.category._id
        : productToEdit.category

    const categoryObject = categories.find((cat) => cat._id === categoryId)

    setInitialValues({
      productName: productToEdit.productName || '',
      description: productToEdit.description || '',
      category: categoryId || '',
      subCategory: productToEdit.subCategory || '',
      price: productToEdit.price || '',
      discount: productToEdit.discount || '',
      quantity: productToEdit.quantity || '',
      unit: productToEdit.unit || '',
      sizes: productToEdit.sizes || [],
      stockQuantity: productToEdit.stockQuantity || '',
      productType: productToEdit.productType || '',
      isAvailable: productToEdit.isAvailable || false,
      isCODAvailable: productToEdit.isCODAvailable || false,
      tags: productToEdit.tags || [],
      colors: productToEdit.variants || [],
      highlights: productToEdit.highlight || '',
      overview: productToEdit.overview || '',
      specifications: productToEdit.specifications || '',
      dimensions: productToEdit.dimensions || { length: '', width: '', height: '', unit: '' },
    })

    setSelectedCategory(categoryObject)
    if (categoryObject?.subCategory?.length) {
      setAvailableSubcategories(categoryObject.subCategory)
    }

    if (categoryObject?.color === true) {
      if (productToEdit.variants?.length > 0) {
        setSelectedColors(
          productToEdit.variants.map((variant) => ({
            ...variant,
            id: variant._id || Date.now() + Math.random(),
            images: variant.images || [],
            imagePreviews: variant.images || [],
          })),
        )
      }
    } else {
      if (productToEdit.images?.length > 0) {
        const existingImages = productToEdit.images || []

        // Populate generalImages with existing image URLs (strings)
        setGeneralImages(existingImages)

        // Use full S3 URLs for previews if you only have keys
        const imagePreviews = existingImages.map((img) =>
          img.startsWith('http') ? img : `${process.env.REACT_APP_S3_BASE_URL}/${img}`,
        )
        setGeneralImagePreviews(imagePreviews)
      }
    }
  }, [isEditMode, productId, allProducts, categories])
  useEffect(() => {
    dispatch(fetchAllCategories({ page: 1, pageSize: 500 }))
  }, [dispatch])

  /** Form Submission ------------------------------------------------------ */
  /** Form Submission ------------------------------------------------------ */
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('values:', values)
    console.log('selectedCategory:', selectedCategory)
    console.log('Category requires color:', selectedCategory?.color)

    try {
      // Check if category requires color-based images
      const requiresColorImages = selectedCategory?.color === true

      if (requiresColorImages) {
        if (selectedColors.length === 0) {
          toast.error('Please add at least one color')
          setSubmitting(false)
          return
        }

        const colorsWithoutImages = selectedColors.filter((color) => color.images.length === 0)
        if (colorsWithoutImages.length > 0) {
          toast.error('Each color must have at least one image')
          setSubmitting(false)
          return
        }
      } else {
        if (generalImages.length === 0) {
          toast.error('Please upload at least one product image')
          setSubmitting(false)
          return
        }
      }

      if (requiresSize(values.category) && (!values.sizes || values.sizes.length === 0)) {
        toast.error('Please select at least one size for clothing items')
        setSubmitting(false)
        return
      }

      if (requiresQuantityUnit(values.category) && (!values.quantity || !values.unit)) {
        toast.error('Quantity and unit are required for this category')
        setSubmitting(false)
        return
      }

      // ✅ Validate dimensions before submitting
      if (
        !values.dimensions ||
        !values.dimensions.length ||
        !values.dimensions.width ||
        !values.dimensions.height ||
        !values.dimensions.unit
      ) {
        toast.error('Dimensions (length, width, height, and unit) are required')
        setSubmitting(false)
        return
      }

      const formData = new FormData()

      if (isEditMode) {
        // Update existing product
        const updatedData = {
          ...values,
          overview: values.overview,
          specifications: values.specifications,
          sizes: requiresSize(values.category) ? values.sizes : undefined,
        }

        // Append basic product fields (excluding colors, sizes, and images)
        Object.entries(updatedData).forEach(([key, val]) => {
          if (key !== 'colors' && key !== 'sizes' && key !== 'images' && key !== 'dimensions') {
            if (Array.isArray(val)) {
              formData.append(key, JSON.stringify(val))
            } else {
              formData.append(key, val)
            }
          }
        })

        // ✅ Append dimensions as JSON
        formData.append('dimensions', JSON.stringify(values.dimensions))

        if (requiresSize(values.category)) {
          formData.append('sizes', JSON.stringify(values.sizes))
        }

        if (requiresColorImages) {
          const colorData = selectedColors.map((color) => ({
            colorName: color.colorName,
            colorCode: color.colorCode,
            imageCount: color.images.length,
          }))

          formData.append('colors', JSON.stringify(colorData))

          selectedColors.forEach((color, colorIndex) => {
            color.images.forEach((file, imageIndex) => {
              formData.append(`color_${colorIndex}_image_${imageIndex}`, file)
            })
          })
        } else {
          formData.append('imageCount', generalImages.length.toString())
          generalImages.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`image_${index}`, item)
            } else if (typeof item === 'string') {
              formData.append(`image_${index}`, item)
            }
          })
        }

        await dispatch(updateProduct({ productId, formData })).unwrap()
      } else {
        // Create new product
        Object.entries(values).forEach(([key, val]) => {
          if (key !== 'colors' && key !== 'sizes' && key !== 'images' && key !== 'dimensions') {
            if (Array.isArray(val)) {
              formData.append(key, JSON.stringify(val))
            } else {
              formData.append(key, val)
            }
          }
        })

        // ✅ Append dimensions as JSON
        formData.append('dimensions', JSON.stringify(values.dimensions))

        if (requiresSize(values.category)) {
          formData.append('sizes', JSON.stringify(values.sizes))
        }

        if (requiresColorImages) {
          const colorData = selectedColors.map((color) => ({
            colorName: color.colorName,
            colorCode: color.colorCode,
            imageCount: color.images.length,
          }))

          formData.append('colors', JSON.stringify(colorData))

          selectedColors.forEach((color, colorIndex) => {
            color.images.forEach((file, imageIndex) => {
              formData.append(`color_${colorIndex}_image_${imageIndex}`, file)
            })
          })
        } else {
          formData.append('imageCount', generalImages.length.toString())
          generalImages.forEach((file, index) => {
            formData.append(`image_${index}`, file)
          })
        }

        await dispatch(createProduct(formData)).unwrap()
      }

      console.log('=== FORM DATA CONTENTS ===')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      navigate('/products')
    } catch (error) {
      console.error('Failed to submit form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  /** Render Component ----------------------------------------------------- */
  return (
    <CRow>
      <CCol xs={12} className="pb-4">
        <CCard className={styles.card}>
          <CCardHeader>
            <h4>{isEditMode ? 'Edit Product' : 'New Product'}</h4>
            <small className="text-muted">
              {isEditMode ? 'Update product information' : 'Add a new product to your inventory'}
            </small>
          </CCardHeader>

          <CCardBody>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={ProductRegistervalidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                handleChange,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
                handleBlur,
              }) => {
                // console.log('Current form values:', values)
                // console.log('Form errors:', errors)
                // console.log('Touched fields:', touched)

                return (
                  <Form>
                    {/* Product Name */}
                    <div className="mb-3">
                      <CFormLabel>Product Name *</CFormLabel>
                      <Field as={CFormInput} name="productName" placeholder="Enter product name" />
                      <ErrorMessage
                        name="productName"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <CFormLabel>Short Description *</CFormLabel>
                      <Field
                        as={CFormTextarea}
                        name="description"
                        rows="3"
                        placeholder="Brief description for listing and search"
                      />
                      <small className="text-muted">
                        Brief description for listing and search (10-500 characters)
                      </small>
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Category & Subcategory */}
                    <CRow>
                      {/* Category Select */}
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Category *</CFormLabel>
                          <CFormSelect
                            name="category"
                            value={values.category}
                            onChange={(e) => handleCategoryChange(e.target.value, setFieldValue)}
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.category}
                              </option>
                            ))}
                          </CFormSelect>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>

                      {/* Subcategory Select */}
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Subcategory *</CFormLabel>
                          <Field as={CFormSelect} name="subCategory" disabled={!values.category}>
                            <option value="">
                              {values.category ? 'Select Subcategory' : 'Select Category First'}
                            </option>
                            {availableSubcategories.map((subcat) => (
                              <option key={subcat} value={subcat}>
                                {subcat}
                              </option>
                            ))}
                          </Field>
                          {values.category && (
                            <small className="text-muted">
                              {availableSubcategories.length} subcategories available
                            </small>
                          )}
                          <ErrorMessage
                            name="subCategory"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>
                    </CRow>

                    {/* Size Checkboxes for Clothes Category */}
                    {requiresSize(values.category) && (
                      <div className="mb-3">
                        <CFormLabel className="fw-bold">Available Sizes *</CFormLabel>
                        <div className="mt-2">
                          <small className="text-muted d-block mb-2">
                            Select all sizes that will be available for this clothing item
                          </small>
                          <div className="row">
                            {CLOTHING_SIZES.map((size, index) => (
                              <div key={size.value} className="col-md-3 col-sm-4 col-6 mb-2">
                                <CFormCheck
                                  type="checkbox"
                                  id={`size-${size.value}`}
                                  label={size.label}
                                  checked={values.sizes?.includes(size.value) || false}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      size.value,
                                      e.target.checked,
                                      setFieldValue,
                                      values.sizes || [],
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          {values.sizes && values.sizes.length > 0 && (
                            <div className="mt-2">
                              <small className="text-success">
                                Selected sizes: {values.sizes.join(', ')}
                              </small>
                            </div>
                          )}
                          <ErrorMessage
                            name="sizes"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    )}

                    {/* Price & Discount */}
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Price *</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                          />
                          <ErrorMessage
                            name="price"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Discount (%)</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="discount"
                            min="0"
                            max="99"
                            placeholder="0"
                          />
                          <small className="text-muted">Optional discount percentage (0-99%)</small>
                        </div>
                      </CCol>
                    </CRow>

                    {/* Price Preview */}
                    {values.price && values.discount && (
                      <div className="mb-3 p-3 bg-light rounded border">
                        <small className="text-muted d-block mb-1">Price Preview:</small>
                        <div className="d-flex gap-3 align-items-center">
                          <span className="text-decoration-line-through text-muted fs-6">
                            {parseFloat(values.price).toFixed(2)}
                          </span>
                          <span className="text-success fw-bold fs-5">
                            {(values.price - (values.price * values.discount) / 100).toFixed(2)}
                          </span>
                          <CBadge color="danger">{values.discount}% OFF</CBadge>
                        </div>
                      </div>
                    )}

                    {/* Stock & Quantity Management */}
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Stock Quantity *</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="stockQuantity"
                            min="0"
                            placeholder="0"
                          />
                          <small className="text-muted">
                            {requiresSize(values.category)
                              ? 'Total number of items available across all sizes'
                              : 'Available quantity in stock'}
                          </small>
                          <ErrorMessage
                            name="stockQuantity"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>

                      {/* Quantity & Unit for Non-Clothing Items */}
                      {requiresQuantityUnit(values.category) && (
                        <CCol md={6}>
                          <div className="mb-3">
                            <CFormLabel>Package Quantity *</CFormLabel>
                            <div className="d-flex gap-2">
                              <Field
                                as={CFormInput}
                                type="number"
                                name="quantity"
                                placeholder="Enter quantity"
                                style={{ flex: '0 0 70%' }}
                                min="0.1"
                                step="0.1"
                              />
                              <Field as={CFormSelect} name="unit" style={{ flex: '0 0 30%' }}>
                                <option value="">Unit</option>
                                {UNITS.map((unit) => (
                                  <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            <small className="text-muted">Quantity per package/unit</small>
                            <ErrorMessage
                              name="quantity"
                              component="div"
                              className="text-danger small"
                            />
                            <ErrorMessage
                              name="unit"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                        </CCol>
                      )}

                      {/* Info for Clothing Items */}
                      {requiresSize(values.category) && (
                        <CCol md={6}>
                          <div className="mb-3">
                            <CFormLabel>Item Type</CFormLabel>
                            <CFormInput value="1 piece" readOnly className="bg-light" />
                            <Field type="hidden" name="quantity" value="1" />
                            <Field type="hidden" name="unit" value="piece" />
                            <small className="text-muted">
                              Clothing items are sold per piece in selected sizes
                            </small>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                    {/* Product Dimensions */}
                    <CRow>
                      <CCol md={3}>
                        <div className="mb-3">
                          <CFormLabel>Length *</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="dimensions.length"
                            placeholder="e.g. 20"
                            min="0.1"
                            step="0.1"
                          />
                          <ErrorMessage
                            name="dimensions.length"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>

                      <CCol md={3}>
                        <div className="mb-3">
                          <CFormLabel>Width *</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="dimensions.width"
                            placeholder="e.g. 15"
                            min="0.1"
                            step="0.1"
                          />
                          <ErrorMessage
                            name="dimensions.width"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>

                      <CCol md={3}>
                        <div className="mb-3">
                          <CFormLabel>Height *</CFormLabel>
                          <Field
                            as={CFormInput}
                            type="number"
                            name="dimensions.height"
                            placeholder="e.g. 10"
                            min="0.1"
                            step="0.1"
                          />
                          <ErrorMessage
                            name="dimensions.height"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>

                      <CCol md={3}>
                        <div className="mb-3">
                          <CFormLabel>Unit *</CFormLabel>
                          <Field as={CFormSelect} name="dimensions.unit">
                            <option value="">Select Unit</option>
                            <option value="cm">cm</option>
                            <option value="m">m</option>
                            <option value="inch">inch</option>
                            <option value="ft">ft</option>
                          </Field>
                          <ErrorMessage
                            name="dimensions.unit"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </CCol>
                    </CRow>

                    {/* Product Type */}
                    <div className="mb-3">
                      <CFormLabel className="fw-bold mb-2">Product Type *</CFormLabel>
                      <div className="d-flex gap-3">
                        <CFormCheck
                          type="radio"
                          name="productType"
                          id="fifteen-min"
                          label="15 Min"
                          value="1"
                          checked={values.productType === '1'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          button={{ color: 'custom-green', variant: 'outline' }}
                          autoComplete="off"
                        />
                        <CFormCheck
                          type="radio"
                          name="productType"
                          id="marketplace"
                          label="Market Place"
                          value="2"
                          checked={values.productType === '2'}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          button={{ color: 'custom-green', variant: 'outline' }}
                          autoComplete="off"
                        />
                      </div>
                      <ErrorMessage
                        name="productType"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Availability Options */}
                    <div className="mb-3">
                      <CFormLabel className="fw-bold mb-2">Availability Options</CFormLabel>
                      <div className="d-flex gap-4">
                        <CFormCheck
                          type="checkbox"
                          name="isAvailable"
                          label="Product is Available"
                          checked={values.isAvailable}
                          onChange={handleChange}
                        />
                        <CFormCheck
                          type="checkbox"
                          name="isCODAvailable"
                          label="Cash on Delivery Available"
                          checked={values.isCODAvailable}
                          onChange={handleChange}
                        />
                      </div>

                      <ErrorMessage
                        name="isAvailable"
                        component="div"
                        className="text-danger small"
                      />
                      <ErrorMessage
                        name="isCODAvailable"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                    {/* Tags */}
                    <div className="mb-3">
                      <CFormLabel>Tags</CFormLabel>
                      <CFormInput
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ',' || e.key === ' ') &&
                            tagInput.trim()
                          ) {
                            e.preventDefault()
                            const newTag = tagInput.trim()
                            if (!values.tags.includes(newTag) && values.tags.length < 10) {
                              setFieldValue('tags', [...values.tags, newTag])
                            }
                            setTagInput('')
                          }
                        }}
                        placeholder="Type and press enter, comma, or space"
                      />
                      <small className="text-muted">
                        Up to 10 tags. Press Enter, comma, or space to add.
                      </small>
                      <div className="d-flex flex-wrap mt-2 gap-2">
                        {values.tags.map((tag, index) => (
                          <CBadge
                            key={index}
                            color="primary"
                            className="d-flex align-items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                setFieldValue(
                                  'tags',
                                  values.tags.filter((_, i) => i !== index),
                                )
                              }
                              style={{
                                background: 'transparent',
                                border: 'none',
                                marginLeft: '4px',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '14px',
                              }}
                            >
                              ×
                            </button>
                          </CBadge>
                        ))}
                      </div>
                      <ErrorMessage name="tags" component="div" className="text-danger small" />
                    </div>

                    {/* ============ PRODUCT CONTENT TAB ============ */}
                    {/* Product Highlights */}
                    <div className="mb-4">
                      <TipTapEditor
                        label="Product Highlights *"
                        content={values.highlights}
                        onChange={(html) => setFieldValue('highlights', html)}
                        placeholder="Enter key features and highlights of your product..."
                      />
                      <small className="text-muted">
                        Highlight the main selling points, key features, and benefits (10-2000
                        characters)
                      </small>
                      <ErrorMessage
                        name="highlights"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                    {/* Product Overview */}
                    <div className="mb-4">
                      <TipTapEditor
                        label="Product Overview *"
                        content={values.overview}
                        onChange={(html) => setFieldValue('overview', html)}
                        placeholder="Write a detailed overview of your product..."
                      />
                      <small className="text-muted">
                        Provide a comprehensive description of the product, its uses, and benefits
                        (20-5000 characters)
                      </small>
                      <ErrorMessage name="overview" component="div" className="text-danger small" />
                    </div>

                    {/* Product Specifications */}
                    <div className="mb-4">
                      <TipTapEditor
                        label="Product Specifications *"
                        content={values.specifications}
                        onChange={(html) => setFieldValue('specifications', html)}
                        placeholder="List detailed technical specifications..."
                      />
                      <small className="text-muted">
                        Include technical details, dimensions, materials, compatibility, etc.
                        (15-3000 characters)
                      </small>
                      <ErrorMessage
                        name="specifications"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                    {/* ============ COLORS & IMAGES TAB ============ */}

                    {selectedCategory?.color ? (
                      // 🔷 If category requires color-based images
                      <div className="mb-4">
                        <CFormLabel className="fw-bold">Product Colors & Images *</CFormLabel>

                        {/* Predefined Colors */}
                        <div className="mb-3">
                          <h6>Quick Add Colors:</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {PREDEFINED_COLORS.map((color) => (
                              <button
                                key={color.code}
                                type="button"
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                onClick={() => addPredefinedColor(color)}
                                disabled={selectedColors.some((c) => c.colorCode === color.code)}
                              >
                                <div
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: color.code,
                                    border: '1px solid #ccc',
                                    borderRadius: '50%',
                                  }}
                                />
                                {color.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Custom Color */}
                        <div className="mb-3">
                          <h6>Add Custom Color:</h6>
                          <div className="d-flex gap-2 align-items-end">
                            <div style={{ flex: 1 }}>
                              <CFormLabel>Color Name</CFormLabel>
                              <CFormInput
                                value={customColorName}
                                onChange={(e) => setCustomColorName(e.target.value)}
                                placeholder="e.g., Sky Blue"
                              />
                            </div>
                            <div>
                              <CFormLabel>Color</CFormLabel>
                              <CFormInput
                                type="color"
                                value={customColorCode}
                                onChange={(e) => setCustomColorCode(e.target.value)}
                                style={{ width: '60px', height: '38px' }}
                              />
                            </div>
                            <CButton
                              color="primary"
                              size="sm"
                              onClick={addCustomColor}
                              disabled={!customColorName.trim()}
                            >
                              Add
                            </CButton>
                          </div>
                        </div>

                        {/* Selected Colors with Image Upload */}
                        {selectedColors.length > 0 && (
                          <div>
                            <h6>Selected Colors ({selectedColors.length}):</h6>
                            {selectedColors.map((color) => {
                              initializeImageRef(color.id)
                              return (
                                <CCard key={color.id} className="mb-3">
                                  <CCardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <div className="d-flex align-items-center gap-2">
                                        <div
                                          style={{
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: color.colorCode,
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                          }}
                                        />
                                        <span className="fw-bold">{color.colorName}</span>
                                        <CBadge color="secondary">{color.colorCode}</CBadge>
                                      </div>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => removeColor(color.id)}
                                      >
                                        Remove
                                      </CButton>
                                    </div>
                                    {/* Image Upload */}
                                    <div className="mb-3">
                                      <CFormLabel>
                                        Images for {color.colorName} (Max 5) *
                                      </CFormLabel>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={imageInputRefs.current[color.id]}
                                        onChange={(e) => handleColorImageChange(color.id, e)}
                                        className="form-control"
                                      />
                                      <small className="text-muted">
                                        {color.images.length}/5 images uploaded
                                      </small>
                                    </div>
                                    {/* Image Previews */}
                                    {color.imagePreviews.length > 0 && (
                                      <div className="d-flex flex-wrap gap-2">
                                        {color.imagePreviews.map((src, index) => (
                                          <div key={index} style={{ position: 'relative' }}>
                                            <img
                                              src={src}
                                              alt={`${color.colorName}-${index}`}
                                              style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '2px solid ' + color.colorCode,
                                              }}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeImageFromColor(color.id, index)}
                                              style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              ✖
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {color.images.length === 0 && (
                                      <CAlert color="warning" className="mt-2">
                                        Please upload at least one image for this color
                                      </CAlert>
                                    )}
                                  </CCardBody>
                                </CCard>
                              )
                            })}
                          </div>
                        )}
                        {selectedColors.length === 0 && (
                          <CAlert color="info">
                            Please add at least one color for your product
                          </CAlert>
                        )}
                      </div>
                    ) : (
                      // 🔶 Otherwise show simple image uploader
                      <div className="mb-4">
                        <CFormLabel className="fw-bold">Product Images *</CFormLabel>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={generalImageInputRef}
                          onChange={handleGeneralImagesChange} // <-- your handler
                          className="form-control"
                        />
                        <small className="text-muted">
                          {generalImages.length}/5 images uploaded
                        </small>

                        {generalImagePreviews.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-3">
                            {generalImagePreviews.map((src, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                <img
                                  src={src}
                                  alt={`preview-${index}`}
                                  style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGeneralImage(index)}
                                  style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  ✖
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {generalImages.length === 0 && (
                          <CAlert color="info" className="mt-2">
                            Please upload at least one image for your product
                          </CAlert>
                        )}
                      </div>
                    )}
                    {/* Form Actions */}
                    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                      <CButton
                        color="secondary"
                        onClick={() => navigate('/products')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </CButton>
                      <CButton
                        color="primary"
                        type="submit"
                        disabled={isSubmitDisabled(isSubmitting)}
                      >
                        {isSubmitting
                          ? isEditMode
                            ? 'Updating...'
                            : 'Creating...'
                          : isEditMode
                            ? 'Update Product'
                            : 'Create Product'}
                      </CButton>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default ProductForm
