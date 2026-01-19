import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CFormLabel,
  CButton,
  CFormInput,
} from '@coreui/react'
import Select from 'react-select'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Star,
  ArrowUp,
  Sparkles,
  Save,
  ArrowRight,
  Box,
  Layers,
} from 'lucide-react'

/* ================== BOOST TYPES ================== */
const boostTypes = [
  {
    label: 'Featured Badge',
    value: 'featured',
    description: 'Premium featured placement',
    icon: Star,
    pricePerDay: 500,
  },
  {
    label: 'Top of List',
    value: 'top_of_list',
    description: 'Appear at top of listings',
    icon: ArrowUp,
    pricePerDay: 700,
  },
  {
    label: 'Highlight Listing',
    value: 'highlight',
    description: 'Highlighted product card',
    icon: Sparkles,
    pricePerDay: 300,
  },
]

/* ================== STEP VALIDATION ================== */
const step1Schema = Yup.object({
  boostType: Yup.string().required('Boost type is required'),
  scopeType: Yup.string().required(),
  duration: Yup.number().required('Duration is required').min(1),
})

const step2Schema = Yup.object({
  productIds: Yup.array().when('scopeType', {
    is: 'product',
    then: (s) => s.min(1, 'Select at least one product'),
  }),
  categoryIds: Yup.array().when('scopeType', {
    is: 'category',
    then: (s) => s.min(1, 'Select at least one category'),
  }),
  startDate: Yup.date()
    .required('Start date required')
    .min(new Date(), 'Start date cannot be in the past'),
})

/* ================== COMPONENT ================== */
const BoostForm = ({ onSubmit, products = [], categories = [], loading }) => {
  const [step, setStep] = useState(1)

  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.productName,
  }))

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }))

  return (
    <Formik
      initialValues={{
        boostType: '',
        scopeType: 'product',
        productIds: [],
        categoryIds: [],
        duration: 7,
        startDate: '',
      }}
      validationSchema={step === 1 ? step1Schema : step2Schema}
      onSubmit={(values) => {
        const selectedBoost = boostTypes.find(
          (b) => b.value === values.boostType,
        )

        const payload = {
          boost_type: values.boostType,
          scope_type: values.scopeType,
          scope_ids:
            values.scopeType === 'product'
              ? values.productIds
              : values.categoryIds,
          duration: {
            value: values.duration,
            unit: 'day',
          },
          price: selectedBoost.pricePerDay * values.duration,
          start_date: values.startDate,
        }

        onSubmit(payload)
      }}
    >
      {({ values, setFieldValue, validateForm }) => {
        const selectedBoost = boostTypes.find(
          (b) => b.value === values.boostType,
        )

        const totalPrice = selectedBoost
          ? selectedBoost.pricePerDay * values.duration
          : 0

        const goNext = async () => {
          const errors = await validateForm()
          if (Object.keys(errors).length === 0) {
            setStep(2)
          }
        }

        return (
          <Form>
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <CCard>
                <CCardBody className="p-5">
                  <h3 className="fw-bold mb-4">Create New Boost</h3>

                  {/* Boost Type */}
                  <CFormLabel className="fw-semibold mb-3">
                    Boost Type *
                  </CFormLabel>

                  <div className="row g-3">
                    {boostTypes.map((type) => {
                      const Icon = type.icon
                      const active = values.boostType === type.value

                      return (
                        <div key={type.value} className="col-md-4">
                          <div
                            onClick={() =>
                              setFieldValue('boostType', type.value)
                            }
                            className={`border rounded p-3 cursor-pointer ${
                              active ? 'border-primary bg-light' : ''
                            }`}
                          >
                            <Icon size={26} />
                            <h6 className="fw-bold mt-2">{type.label}</h6>
                            <p className="small text-muted">
                              {type.description}
                            </p>
                            <p className="small fw-semibold text-primary">
                              {type.pricePerDay} SYP / day
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <ErrorMessage
                    name="boostType"
                    component="div"
                    className="text-danger small mt-1"
                  />

                  {/* Scope */}
                  <CFormLabel className="fw-semibold mt-4">
                    Apply Boost To *
                  </CFormLabel>
                  <div className="d-flex gap-3 mb-3">
                    <div
                      onClick={() => setFieldValue('scopeType', 'product')}
                      className={`p-3 border rounded w-50 cursor-pointer ${
                        values.scopeType === 'product'
                          ? 'bg-primary text-white'
                          : ''
                      }`}
                    >
                      <Box size={18} /> Products
                    </div>
                    <div
                      onClick={() => setFieldValue('scopeType', 'category')}
                      className={`p-3 border rounded w-50 cursor-pointer ${
                        values.scopeType === 'category'
                          ? 'bg-primary text-white'
                          : ''
                      }`}
                    >
                      <Layers size={18} /> Categories
                    </div>
                  </div>

                  {/* Duration */}
                  <CFormLabel className="fw-semibold">
                    Duration (Days) *
                  </CFormLabel>
                  <Field name="duration">
                    {({ field }) => (
                      <CFormInput {...field} type="number" min={1} />
                    )}
                  </Field>

                  <ErrorMessage
                    name="duration"
                    component="div"
                    className="text-danger small"
                  />

                  <div className="mt-4 text-end">
                    <CButton type="button" onClick={goNext}>
                      Continue <ArrowRight size={16} className="ms-1" />
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <CCard>
                <CCardBody className="p-5">
                  <h4 className="fw-bold mb-4">Schedule & Payment</h4>

                  {values.scopeType === 'product' ? (
                    <>
                      <Select
                        isMulti
                        options={productOptions}
                        onChange={(v) =>
                          setFieldValue(
                            'productIds',
                            v ? v.map((i) => i.value) : [],
                          )
                        }
                      />
                      <ErrorMessage
                        name="productIds"
                        component="div"
                        className="text-danger small"
                      />
                    </>
                  ) : (
                    <>
                      <Select
                        isMulti
                        options={categoryOptions}
                        onChange={(v) =>
                          setFieldValue(
                            'categoryIds',
                            v ? v.map((i) => i.value) : [],
                          )
                        }
                      />
                      <ErrorMessage
                        name="categoryIds"
                        component="div"
                        className="text-danger small"
                      />
                    </>
                  )}

                  {/* Start Date */}
                  <CFormLabel className="fw-semibold mt-4">
                    Start Date *
                  </CFormLabel>
                  <Field name="startDate">
                    {({ field }) => (
                      <CFormInput
                        {...field}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    )}
                  </Field>

                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-danger small"
                  />

                  {/* Summary */}
                  <div className="mt-4 p-3 border rounded">
                    <p>
                      <strong>Boost:</strong> {selectedBoost?.label}
                    </p>
                    <p>
                      <strong>Duration:</strong> {values.duration} days
                    </p>
                    <p>
                      <strong>Total Cost:</strong> {totalPrice} SYP
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <CButton
                      type="button"
                      color="secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </CButton>
                    <CButton
                      type="submit"
                      disabled={loading}
                      color="success"
                    >
                      <Save size={16} className="me-1" />
                      Activate Boost
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            )}
          </Form>
        )
      }}
    </Formik>
  )
}

export default BoostForm
