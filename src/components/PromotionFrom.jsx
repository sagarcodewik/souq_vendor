import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CFormLabel,
  CRow,
  CCol,
  CButton,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import Select from 'react-select'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import {
  Save,
  CalendarDays,
  Percent,
  Tag,
  Package,
  Zap,
  Gift,
  Star,
  ArrowRight,
  Crown,
  AlertTriangle,
  DollarSign,
  Layers,
  Box,
} from 'lucide-react'

// Custom CSS styles for Bootstrap enhancement
const customStyles = `
<style>
  .gradient-bg {
    background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #e0e7ff 100%);
    min-height: 100vh;
  }

  .gradient-header-icon {
    background: linear-gradient(135deg, #103033, #0B737F);
  }

  .gradient-text {
    background: linear-gradient(135deg, #1f2937, #4b5563);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .step-active {
    background: linear-gradient(135deg, #103033, #0B737F) !important;
    color: white !important;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  }

  .step-inactive {
    background: #e5e7eb !important;
    color: #6b7280 !important;
  }

  .step-line-active {
    background: linear-gradient(90deg, #103033, #167f8bff) !important;
  }

  .step-line-inactive {
    background: #e5e7eb !important;
  }

  .form-card {
    background: white;
    border-radius: 24px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
    border: none !important;
    animation: slideInRight 0.5s ease-out;
  }

  .gradient-bar {
    width: 8px;
    background: linear-gradient(180deg, #103033, #0B737F);
    border-radius: 4px;
  }

  .form-control-enhanced {
    border: 2px solid #e5e7eb !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
    transition: all 0.2s ease !important;
  }

  .form-control-enhanced:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
    outline: none !important;
  }

  .form-control-enhanced:hover {
    border-color: #9ca3af !important;
  }

  .form-control-error {
    border-color: #ef4444 !important;
    background-color: #fef2f2 !important;
  }

  .form-control-with-icon {
    padding-left: 48px !important;
  }

  .type-card {
    height: 100%;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .type-card:hover {
    transform: scale(1.02);
    border-color: #9ca3af;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .type-card-selected {
    border-color: #3b82f6 !important;
    background-color: #dbeafe !important;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2) !important;
  }

  .type-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 12px;
  }

  .type-icon-promotion {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }

  .type-icon-flash {
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }

  .type-icon-bundle {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }
  .paid-flag-card {
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    height: 100%;
  }

  .paid-flag-card:hover {
    transform: scale(1.02);
    border-color: #9ca3af;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .paid-flag-card-selected {
    border-color: #f59e0b !important;
    background-color: #fef3c7 !important;
    box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2) !important;
  }

  .paid-flag-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 12px;
  }

  .paid-flag-icon-urgent {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }

  .paid-flag-icon-featured {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }
  .paid-flag-text{
    display: flex;
    align-items: flex-start;
    gap: 1em;
    // justify-content: space-between;
  }
  .paid-flag-badge {
    // position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    // outline: 2px solid red;
  }
  .btn-enhanced {
    border-radius: 12px !important;
    padding: 12px 32px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    border: none !important;
  }

  .btn-primary-gradient {
    background: linear-gradient(135deg, #103033, #a1c0c4) !important;
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4) !important;
  }

  .btn-primary-gradient:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.4) !important;
  }

  .btn-success-gradient {
    background: linear-gradient(135deg, #103033, #a1c0c4) !important;
    box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.4) !important;
  }

  .btn-success-gradient:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(5, 150, 105, 0.4) !important;
  }

  .btn-outline-enhanced {
    border: 2px solid #d1d5db !important;
    color: #363e4bff !important;
    background: white !important;
  }

  .btn-outline-enhanced:hover {
    background: #f9fafb !important;
    border-color: #9ca3af !important;
  }

  .summary-card {
    background: linear-gradient(135deg, #dbeafe, #e0e7ff) !important;
    border: 1px solid #bfdbfe !important;
    border-radius: 16px !important;
    padding: 24px !important;
  }

  .icon-position {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .selected-indicator {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selected-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid white;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .react-select-enhanced .react-select__control {
    border: 2px solid #e5e7eb !important;
    border-radius: 12px !important;
    padding: 4px 8px !important;
    min-height: 48px !important;
  }

  .react-select-enhanced .react-select__control:hover {
    border-color: #9ca3af !important;
  }

  .react-select-enhanced .react-select__control--is-focused {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
  }

  .react-select-enhanced .react-select__multi-value {
    background-color: #dbeafe !important;
    border-radius: 8px !important;
  }

  .react-select-enhanced .react-select__multi-value__label {
    color: #1e40af !important;
    font-weight: 500 !important;
  }

  .react-select-enhanced .react-select__multi-value__remove {
    color: #1e40af !important;
  }

  .react-select-enhanced .react-select__multi-value__remove:hover {
    background-color: #bfdbfe !important;
    color: #1d4ed8 !important;
  }
</style>
`

const typeOptions = [
  {
    label: 'Promotion',
    value: 'promotion',
    icon: Tag,
    description: 'Standard promotional offer with discount code',
    iconClass: 'type-icon-promotion',
  },
  {
    label: 'Flash Sale',
    value: 'flash-sale',
    icon: Zap,
    description: 'Time-limited high-impact sale',
    iconClass: 'type-icon-flash',
  },
  {
    label: 'Bundle',
    value: 'bundle',
    icon: Gift,
    description: 'Multiple products packaged together',
    iconClass: 'type-icon-bundle',
  },
]

const paidFlagOptions = [
  {
    label: 'Urgent',
    value: 'urgent',
    icon: AlertTriangle,
    description: 'High priority promotion with urgent visibility',
    iconClass: 'paid-flag-icon-urgent',
  },
  {
    label: 'Featured',
    value: 'featured',
    icon: Crown,
    description: 'Premium placement in featured sections',
    iconClass: 'paid-flag-icon-featured',
  },
]

// Yup validation with start/end date logic
// Yup validation with start/end date logic
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Type is required'),
  paidFlag: Yup.string(),
  discountType: Yup.string().required('Discount type is required'),
  discountValue: Yup.number()
    .required('Discount value is required')
    .min(1, 'Min 1')
    .when('discountType', {
      is: 'Percentage',
      then: (schema) => schema.max(100, 'Max 100%'),
      otherwise: (schema) => schema.notRequired(), // No max for fixed amount
    }),
  scopeType: Yup.string().required('Scope is required'),
  productIds: Yup.array().when('scopeType', {
    is: 'product',
    then: (schema) => schema.min(1, 'Select at least 1 product').required('Products are required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  categoryIds: Yup.array().when('scopeType', {
    is: 'category',
    then: (schema) =>
      schema.min(1, 'Select at least 1 category').required('Categories are required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().when('type', {
    is: (val) => val !== 'flash-sale',
    then: (schema) =>
      schema
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date cannot be before Start Date'),
    otherwise: (schema) => schema.notRequired(),
  }),
  hours: Yup.number().when('type', {
    is: 'flash-sale',
    then: (schema) =>
      schema.required('Duration in hours is required').min(1).max(168, 'Max 7 days'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const PromotionForm = ({ onSubmit, initialValues = {}, loading, products, categories = [] }) => {
  const [step, setStep] = useState(1)

  const productOptions = products.map((prod) => ({
    value: prod._id,
    label: prod.productName,
  }))

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.category,
  }))

  const defaultValues = {
    title: '',
    description: '',
    discountValue: '',
    discountType: 'Percentage',
    scopeType: 'product',
    type: '',
    promotionCode: '',
    paidFlag: '',
    productIds: [],
    categoryIds: [],
    startDate: '',
    endDate: '',
    ...initialValues,
  }

  const validateStep = (values, currentStep) => {
    const errors = {}

    if (currentStep === 1) {
      if (!values.title) errors.title = 'Title is required'
      if (!values.type) errors.type = 'Type is required'
      if (!values.discountValue) {
        errors.discountValue = 'Discount value is required'
      } else if (
        values.discountType === 'Percentage' &&
        (values.discountValue < 1 || values.discountValue > 100)
      ) {
        errors.discountValue = 'Discount must be between 1-100%'
      }
    }

    return errors
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="gradient-bg">
        <div className="container-fluid px-4 py-3">
          <div className="row justify-content-center">
            <div className="col-10 col-lg-10 col-xl-10">
              {/* Header */}
              <div className="text-center mb-3">
                <div
                  className="gradient-header-icon rounded-3 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ width: '54px', height: '54px' }}
                >
                  <Star size={32} color="white" />
                </div>
                <h4 className="display-6 fw-bold gradient-text mb-3">Create New Promotion</h4>
                <p className="fs-6 text-muted">
                  Set up compelling offers to boost your sales and engage customers
                </p>
              </div>

              {/* Progress Steps */}
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="d-flex align-items-center">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-semibold transition ${
                      step >= 1 ? 'step-active' : 'step-inactive'
                    }`}
                    style={{ width: '25px', height: '25px' }}
                  >
                    1
                  </div>
                  <div
                    className={`mx-3 ${step >= 2 ? 'step-line-active' : 'step-line-inactive'}`}
                    style={{ width: '80px', height: '4px', borderRadius: '2px' }}
                  ></div>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-semibold transition ${
                      step >= 2 ? 'step-active' : 'step-inactive'
                    }`}
                    style={{ width: '25px', height: '25px' }}
                  >
                    2
                  </div>
                </div>
              </div>

              <Formik
                initialValues={defaultValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={(values, { resetForm }) => {
                  const toEndOfDayUTC = (dateStr) => {
                    if (!dateStr) return null

                    const localEndOfDay = new Date(dateStr)
                    localEndOfDay.setHours(23, 59, 59, 999)
                    return localEndOfDay.toISOString()
                  }
                  const toStartOfDayUTC = (dateStr) => {
                    if (!dateStr) return null

                    const localStart = new Date(dateStr)
                    localStart.setHours(0, 1, 0, 0)
                    return localStart.toISOString()
                  }

                  onSubmit(
                    {
                      ...values,
                      startDate: toStartOfDayUTC(values.startDate),
                      endDate: toEndOfDayUTC(values.endDate),
                    },
                    { resetForm },
                  )
                }}
              >
                {({ values, setFieldValue, errors, touched }) => {
                  const selectedType = typeOptions.find((type) => type.value === values.type)

                  const handleNext = () => {
                    const stepErrors = validateStep(values, step)
                    if (Object.keys(stepErrors).length === 0) {
                      setStep(2)
                    }
                  }

                  return (
                    <Form>
                      {/* Step 1: Basic Information */}
                      {step === 1 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CCard className="form-card border-0">
                            <CCardBody className="p-5">
                              <div className="d-flex align-items-center mb-4">
                                <div className="gradient-bar me-3" style={{ height: '32px' }}></div>
                                <h2 className="h3 fw-bold text-dark mb-0">Basic Information</h2>
                              </div>

                              {/* Title */}
                              <div className="mb-4">
                                <CFormLabel className="fw-semibold text-dark mb-2">
                                  Promotion Title *
                                </CFormLabel>
                                <Field name="title">
                                  {({ field }) => (
                                    <CFormInput
                                      {...field}
                                      className={`form-control-enhanced ${
                                        errors.title && touched.title ? 'form-control-error' : ''
                                      }`}
                                      placeholder="Enter promotion title..."
                                    />
                                  )}
                                </Field>
                                <div className="text-danger small mt-2">
                                  <ErrorMessage name="title" />
                                </div>
                              </div>

                              {/* Type Selection */}
                              <div className="mb-4">
                                <CFormLabel className="fw-semibold text-dark mb-3">
                                  Promotion Type *
                                </CFormLabel>
                                <div className="row g-3">
                                  {typeOptions.map((type) => {
                                    const IconComponent = type.icon
                                    const isSelected = values.type === type.value

                                    return (
                                      <div key={type.value} className="col-12 col-md-4">
                                        <div
                                          onClick={() => setFieldValue('type', type.value)}
                                          className={`type-card ${isSelected ? 'type-card-selected' : ''}`}
                                        >
                                          <div className={`type-icon ${type.iconClass}`}>
                                            <IconComponent size={24} />
                                          </div>
                                          <h5 className="fw-bold text-dark mb-2">{type.label}</h5>
                                          <p className="text-muted small mb-0">
                                            {type.description}
                                          </p>

                                          {isSelected && (
                                            <div className="selected-indicator">
                                              <div className="selected-dot"></div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                                <div className="text-danger small mt-2">
                                  <ErrorMessage name="type" />
                                </div>
                              </div>

                              {/* Discount Section */}
                              <div className="mb-4">
                                <CRow>
                                  <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-dark mb-2">
                                      Discount Type *
                                    </CFormLabel>
                                    <div className="d-flex gap-3 mb-3">
                                      <div
                                        onClick={() => setFieldValue('discountType', 'Percentage')}
                                        className={`p-3 rounded-3 cursor-pointer w-50 text-center transition ${
                                          values.discountType === 'Percentage'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-light text-muted border'
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <Percent size={20} className="mb-1 d-block mx-auto" />
                                        <span className="fw-semibold small">Percentage</span>
                                      </div>
                                      <div
                                        onClick={() => setFieldValue('discountType', 'Fixed')}
                                        className={`p-3 rounded-3 cursor-pointer w-50 text-center transition ${
                                          values.discountType === 'Fixed'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-light text-muted border'
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <DollarSign size={20} className="mb-1 d-block mx-auto" />
                                        <span className="fw-semibold small">Fixed Amount</span>
                                      </div>
                                    </div>
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-dark mb-2">
                                      {values.discountType === 'Percentage'
                                        ? 'Discount Percentage *'
                                        : 'Discount Amount *'}
                                    </CFormLabel>
                                    <div className="position-relative">
                                      <Field name="discountValue">
                                        {({ field }) => (
                                          <CFormInput
                                            {...field}
                                            type="number"
                                            min={1}
                                            max={
                                              values.discountType === 'Percentage' ? 100 : undefined
                                            }
                                            className={`form-control-enhanced form-control-with-icon ${
                                              errors.discountValue && touched.discountValue
                                                ? 'form-control-error'
                                                : ''
                                            }`}
                                            placeholder={
                                              values.discountType === 'Percentage'
                                                ? '0-100'
                                                : '0.00'
                                            }
                                          />
                                        )}
                                      </Field>
                                      {values.discountType === 'Percentage' ? (
                                        <Percent className="icon-position" size={20} />
                                      ) : (
                                        <DollarSign className="icon-position" size={20} />
                                      )}
                                    </div>
                                    <div className="text-danger small mt-2">
                                      <ErrorMessage name="discountValue" />
                                    </div>
                                  </CCol>
                                </CRow>

                                <div className="mb-4">
                                  <CFormLabel className="fw-semibold text-dark mb-3">
                                    Paid Flag *
                                    <span className="badge bg-warning text-dark ms-2 small">
                                      PAID
                                    </span>
                                  </CFormLabel>
                                  <div className="row g-3">
                                    {paidFlagOptions.map((flag) => {
                                      const IconComponent = flag.icon
                                      const isSelected = values.paidFlag === flag.value

                                      return (
                                        <div key={flag.value} className="col-12 col-md-6">
                                          <div
                                            onClick={() => setFieldValue('paidFlag', flag.value)}
                                            className={`paid-flag-card ${isSelected ? 'paid-flag-card-selected' : ''}`}
                                          >
                                            <div className={`paid-flag-icon ${flag.iconClass}`}>
                                              <IconComponent size={22} />
                                            </div>
                                            <div className="paid-flag-text">
                                              <h5 className="fw-bold text-dark mb-2">
                                                {flag.label}
                                              </h5>
                                              <div className="paid-flag-badge">PAID</div>
                                            </div>

                                            <p className="text-muted small mb-0">
                                              {flag.description}
                                            </p>

                                            {isSelected && (
                                              <div
                                                className="selected-indicator"
                                                style={{ background: '#f59e0b' }}
                                              >
                                                <div className="selected-dot"></div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <div className="text-danger small mt-2">
                                    <ErrorMessage name="paidFlag" />
                                  </div>
                                </div>
                              </div>

                              {/* Promotion Code - only for promotion type */}
                              <CRow className="mb-4">
                                {values.type === 'promotion' && (
                                  <CCol md={6}>
                                    <CFormLabel className="fw-semibold text-dark mb-2">
                                      Promotion Code
                                    </CFormLabel>
                                    <div className="position-relative">
                                      <Field name="promotionCode">
                                        {({ field }) => (
                                          <CFormInput
                                            {...field}
                                            onChange={(e) =>
                                              setFieldValue(
                                                'promotionCode',
                                                e.target.value.toUpperCase(),
                                              )
                                            }
                                            className="form-control-enhanced form-control-with-icon"
                                            placeholder="SAVE20"
                                          />
                                        )}
                                      </Field>
                                      <Tag className="icon-position" size={20} />
                                    </div>
                                  </CCol>
                                )}
                              </CRow>

                              {/* Description */}
                              <div className="mb-4">
                                <CFormLabel className="fw-semibold text-dark mb-2">
                                  Description
                                </CFormLabel>
                                <Field name="description">
                                  {({ field }) => (
                                    <CFormTextarea
                                      {...field}
                                      rows={4}
                                      className="form-control-enhanced"
                                      placeholder="Describe your promotion..."
                                      style={{ resize: 'none' }}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="d-flex justify-content-end pt-3">
                                <CButton
                                  type="button"
                                  onClick={handleNext}
                                  className="btn-enhanced btn-primary-gradient d-flex align-items-center"
                                >
                                  Continue
                                  <ArrowRight className="ms-2" size={20} />
                                </CButton>
                              </div>
                            </CCardBody>
                          </CCard>
                        </div>
                      )}

                      {/* Step 2: Products and Schedule */}
                      {step === 2 && (
                        <CCard className="form-card border-0">
                          <CCardBody className="p-5">
                            <div className="d-flex align-items-center mb-4">
                              <div
                                className="me-3"
                                style={{
                                  width: '8px',
                                  height: '32px',
                                  background: 'linear-gradient(180deg, #103033, #0B737F)',
                                  borderRadius: '4px',
                                }}
                              ></div>
                              <h2 className="h3 fw-bold text-dark mb-0">Products & Schedule</h2>
                            </div>

                            {/* Scope Selection */}
                            <div className="mb-4">
                              <CFormLabel className="fw-semibold text-dark mb-3">
                                Apply Promotion To *
                              </CFormLabel>
                              <div className="d-flex gap-3 mb-4">
                                <div
                                  onClick={() => setFieldValue('scopeType', 'product')}
                                  className={`p-4 rounded-3 cursor-pointer flex-fill border transition d-flex align-items-center ${
                                    values.scopeType === 'product'
                                      ? 'border-primary bg-primary-subtle'
                                      : 'bg-white border-light-subtle'
                                  }`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div
                                    className={`p-2 rounded-circle me-3 ${values.scopeType === 'product' ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                                  >
                                    <Box size={24} />
                                  </div>
                                  <div>
                                    <h6 className="fw-bold mb-1">Specific Products</h6>
                                    <p className="mb-0 small text-muted">Select individual items</p>
                                  </div>
                                  {values.scopeType === 'product' && (
                                    <div className="ms-auto text-primary">
                                      <div className="rounded-circle bg-primary p-1">
                                        <div
                                          className="bg-white rounded-circle"
                                          style={{ width: '8px', height: '8px' }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div
                                  onClick={() => setFieldValue('scopeType', 'category')}
                                  className={`p-4 rounded-3 cursor-pointer flex-fill border transition d-flex align-items-center ${
                                    values.scopeType === 'category'
                                      ? 'border-primary bg-primary-subtle'
                                      : 'bg-white border-light-subtle'
                                  }`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div
                                    className={`p-2 rounded-circle me-3 ${values.scopeType === 'category' ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                                  >
                                    <Layers size={24} />
                                  </div>
                                  <div>
                                    <h6 className="fw-bold mb-1">Categories</h6>
                                    <p className="mb-0 small text-muted">
                                      Apply to entire categories
                                    </p>
                                  </div>
                                  {values.scopeType === 'category' && (
                                    <div className="ms-auto text-primary">
                                      <div className="rounded-circle bg-primary p-1">
                                        <div
                                          className="bg-white rounded-circle"
                                          style={{ width: '8px', height: '8px' }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {values.scopeType === 'product' ? (
                                <>
                                  <CFormLabel className="fw-semibold text-dark mb-2">
                                    Select Products *
                                  </CFormLabel>
                                  <div className="bg-light p-3 rounded-3">
                                    <Select
                                      options={productOptions}
                                      isMulti
                                      value={productOptions.filter((p) =>
                                        values.productIds.includes(p.value),
                                      )}
                                      onChange={(selected) =>
                                        setFieldValue(
                                          'productIds',
                                          selected ? selected.map((s) => s.value) : [],
                                        )
                                      }
                                      className="react-select-enhanced"
                                      classNamePrefix="react-select"
                                      placeholder="Search and select products..."
                                    />
                                  </div>
                                  <div className="text-danger small mt-2">
                                    <ErrorMessage name="productIds" />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <CFormLabel className="fw-semibold text-dark mb-2">
                                    Select Categories *
                                  </CFormLabel>
                                  <div className="bg-light p-3 rounded-3">
                                    <Select
                                      options={categoryOptions}
                                      isMulti
                                      value={categoryOptions.filter((c) =>
                                        values.categoryIds.includes(c.value),
                                      )}
                                      onChange={(selected) =>
                                        setFieldValue(
                                          'categoryIds',
                                          selected ? selected.map((s) => s.value) : [],
                                        )
                                      }
                                      className="react-select-enhanced"
                                      classNamePrefix="react-select"
                                      placeholder="Search and select categories..."
                                    />
                                  </div>
                                  <div className="text-danger small mt-2">
                                    <ErrorMessage name="categoryIds" />
                                  </div>
                                </>
                              )}
                            </div>

                            <CRow className="mb-4">
                              <CCol md={6}>
                                <CFormLabel className="fw-semibold text-dark mb-2">
                                  Start Date *
                                </CFormLabel>
                                <div className="position-relative">
                                  <Field name="startDate">
                                    {({ field }) => (
                                      <CFormInput
                                        {...field}
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`form-control-enhanced form-control-with-icon ${
                                          errors.startDate && touched.startDate
                                            ? 'form-control-error'
                                            : ''
                                        }`}
                                      />
                                    )}
                                  </Field>
                                  <CalendarDays className="icon-position" size={20} />
                                </div>
                                <div className="text-danger small mt-2">
                                  <ErrorMessage name="startDate" />
                                </div>
                              </CCol>

                              {/* Conditionally show End Date OR Hours */}
                              {values.type === 'flash-sale' ? (
                                <CCol md={6}>
                                  <CFormLabel className="fw-semibold text-dark mb-2">
                                    Duration (Hours) *
                                  </CFormLabel>
                                  <Field name="hours">
                                    {({ field }) => (
                                      <CFormInput
                                        {...field}
                                        type="number"
                                        min={1}
                                        className={`form-control-enhanced form-control-with-icon ${
                                          errors.hours && touched.hours ? 'form-control-error' : ''
                                        }`}
                                        placeholder="Enter duration in hours"
                                      />
                                    )}
                                  </Field>
                                  <div className="text-danger small mt-2">
                                    <ErrorMessage name="hours" />
                                  </div>
                                </CCol>
                              ) : (
                                <CCol md={6}>
                                  <CFormLabel className="fw-semibold text-dark mb-2">
                                    End Date *
                                  </CFormLabel>
                                  <div className="position-relative">
                                    <Field name="endDate">
                                      {({ field }) => (
                                        <CFormInput
                                          {...field}
                                          type="date"
                                          min={
                                            values.startDate ||
                                            new Date().toISOString().split('T')[0]
                                          }
                                          className={`form-control-enhanced form-control-with-icon ${
                                            errors.endDate && touched.endDate
                                              ? 'form-control-error'
                                              : ''
                                          }`}
                                        />
                                      )}
                                    </Field>
                                    <CalendarDays className="icon-position" size={20} />
                                  </div>
                                  <div className="text-danger small mt-2">
                                    <ErrorMessage name="endDate" />
                                  </div>
                                </CCol>
                              )}
                            </CRow>

                            {/* Summary Card */}
                            {values.title && selectedType && (
                              <div className="summary-card mb-4">
                                <h5 className="fw-bold text-dark mb-3">Promotion Summary</h5>
                                <div className="small">
                                  <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Title:</span>
                                    <span className="fw-semibold text-dark">{values.title}</span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Type:</span>
                                    <span className="fw-semibold text-dark">
                                      {selectedType.label}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Discount:</span>
                                    <span className="fw-semibold text-success">
                                      {values.discountType === 'Percentage'
                                        ? `${values.discountValue}%`
                                        : `$${values.discountValue}`}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span className="text-muted">Products:</span>
                                    <span className="fw-semibold text-dark">
                                      {values.productIds.length} selected
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="d-flex justify-content-between pt-3">
                              <CButton
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn-enhanced btn-outline-enhanced"
                              >
                                Back
                              </CButton>
                              <CButton
                                type="submit"
                                disabled={loading}
                                className={`btn-enhanced btn-success-gradient d-flex align-items-center ${
                                  loading ? 'opacity-75' : ''
                                }`}
                              >
                                {loading ? (
                                  <>
                                    <div className="loading-spinner me-2"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="me-2" size={20} />
                                    Save Promotion
                                  </>
                                )}
                              </CButton>
                            </div>
                          </CCardBody>
                        </CCard>
                      )}
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PromotionForm
