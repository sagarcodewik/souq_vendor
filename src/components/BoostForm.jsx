import React, { useState } from 'react'
import { CCard, CCardBody, CFormLabel, CButton, CFormInput } from '@coreui/react'
import Select from 'react-select'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Star, ArrowUp, Sparkles, Save, ArrowRight, Box, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

const BoostForm = ({
  onSubmit,
  initialValues = {},
  products = [],
  categories = [],
  loading,
  mode = 'create',
  status,
}) => {
  const [step, setStep] = useState(1)
   const { t } = useTranslation('boosts')
  const productOptions = products.map((p) => ({
    value: p._id,
    label: p.productName,
  }))

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.category,
  }))
  return (
    <div style={{ minHeight: '80vh', fontFamily: "'Inter', sans-serif" }}>
      <Formik
        initialValues={{
          boostType: '',
          scopeType: 'product',
          productIds: [],
          categoryIds: [],
          duration: 7,
          startDate: '',
          ...initialValues,
        }}
        validationSchema={step === 1 ? step1Schema : step2Schema}
        enableReinitialize
        onSubmit={(values) => {
          const selectedBoost = boostTypes.find((b) => b.value === values.boostType)

          const payload = {
            boost_type: values.boostType,
            scope_type: values.scopeType,
            scope_ids: values.scopeType === 'product' ? values.productIds : values.categoryIds,
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
          const selectedBoost = boostTypes.find((b) => b.value === values.boostType)

          const totalPrice = selectedBoost ? selectedBoost.pricePerDay * values.duration : 0

          const goNext = async () => {
            const errors = await validateForm()
            if (Object.keys(errors).length === 0) {
              setStep(2)
            }
          }

          return (
            <Form>
              <CCard
                className="border-0 shadow-sm"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'white',
                }}
              >
                <div className="px-5 pt-5 pb-3">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2
                      className="mb-0"
                      style={{
                        fontWeight: '800',
                        fontSize: '32px',
                        background: 'linear-gradient(45deg, #1e293b, #334155)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {step === 1 ? t('Choose Your Boost') : t('Targeting & Schedule')}
                    </h2>
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}
                    >
                      <span className={step >= 1 ? 'text-primary' : ''}>Step 1</span>
                      <div style={{ width: '20px', height: '2px', background: '#e2e8f0' }} />
                      <span className={step >= 2 ? 'text-primary' : ''}>Step 2</span>
                    </div>
                  </div>
                </div>

                <CCardBody className="px-5 pb-5 pt-0">

                  {step === 1 && (
                    <div>
                      <p className="text-muted mb-4" style={{ fontSize: '16px' }}>
                        {t('Choose Your Boost')}
                      </p>
                      <div className="row g-4 mb-5">
                        {boostTypes.map((type) => {
                          const Icon = type.icon
                          const active = values.boostType === type.value

                          return (
                            <div key={type.value} className="col-lg-4">
                              <div
                                onClick={() => setFieldValue('boostType', type.value)}
                                style={{
                                  border: active ? '2px solid #22c55e' : '2px solid #f1f5f9',
                                  borderRadius: '20px',
                                  padding: '24px',
                                  cursor: 'pointer',
                                  background: active ? '#eef2ff' : 'white',
                                  transition: 'all 0.2s ease',
                                  height: '100%',
                                  position: 'relative',
                                  transform: active ? 'translateY(-4px)' : 'none',
                                  boxShadow: active
                                    ? '0 10px 20px -5px hsla(170, 57%, 65%, 0.15)'
                                    : 'none',
                                }}
                              >
                                {active && (
                                  <div className="position-absolute top-0 end-0 m-3 text-primary">
                                    <div className="bg-primary text-white rounded-circle p-1">
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="3"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}

                                <div
                                  className={`mb-3 rounded-circle d-flex align-items-center justify-content-center ${
                                    active ? 'bg-primary text-white' : 'bg-light text-secondary'
                                  }`}
                                  style={{
                                    width: '56px',
                                    height: '56px',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <Icon size={28} />
                                </div>

                                <h5 className="fw-bold text-dark mb-2"> {t(type.labelKey)}</h5>
                                <p className="text-muted mb-3 small" style={{ lineHeight: '1.5' }}>
                                 {t(type.descriptionKey)}
                                </p>
                                <div className="pt-3 border-top">
                                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                                    {type.pricePerDay}
                                  </span>
                                  <span className="text-secondary small"> {t('Currency')} / {t('Per Day')}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <ErrorMessage
                        name="boostType"
                        component="div"
                        className="text-danger small mt-n4 mb-4"
                      />

                      {/* Scope Selection */}
                      <div className="row g-4 mb-4">
                        <div className="col-md-6">
                          <CFormLabel className="fw-bold text-dark mb-2">{t('Apply Boost To')}</CFormLabel>
                          <div className="d-flex p-1 bg-light rounded-pill border">
                            <div
                              onClick={() => setFieldValue('scopeType', 'product')}
                              className={`flex-fill text-center py-2 rounded-pill cursor-pointer fw-semibold ${
                                values.scopeType === 'product'
                                  ? 'bg-white shadow-sm text-primary'
                                  : 'text-muted'
                              }`}
                              style={{ transition: 'all 0.2s' }}
                            >
                              <Box size={16} className="me-2 mb-1" />{t('Products')}
                            </div>
                            <div
                              onClick={() => setFieldValue('scopeType', 'category')}
                              className={`flex-fill text-center py-2 rounded-pill cursor-pointer fw-semibold ${
                                values.scopeType === 'category'
                                  ? 'bg-white shadow-sm text-primary'
                                  : 'text-muted'
                              }`}
                              style={{ transition: 'all 0.2s' }}
                            >
                              <Layers size={16} className="me-2 mb-1" /> {t('Categories')}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <CFormLabel className="fw-bold text-dark mb-2">
                            {t('Duration')} ({t('Day')})
                          </CFormLabel>
                          <Field name="duration">
                            {({ field }) => (
                              <CFormInput
                                {...field}
                                type="number"
                                min={1}
                                style={{
                                  padding: '12px',
                                  borderRadius: '12px',
                                  border: '1px solid #e2e8f0',
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="duration"
                            component="div"
                            className="text-danger small mt-1"
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-5 pt-3 border-top">
                        <CButton
                          type="button"
                          onClick={goNext}
                          className="btn-enhanced btn-primary-gradient d-flex align-items-center"
                          style={{
                            background: 'linear-gradient(135deg, #15686eff 0%, #53d8ddff 100%)',
                          }}
                        >
                         {t('Continue')}<ArrowRight size={20} className="ms-2" />
                        </CButton>
                      </div>
                    </div>
                  )}

                  {/* ================= STEP 2 ================= */}
                  {step === 2 && (
                    <div>
                      <p className="text-muted mb-4" style={{ fontSize: '16px' }}>
                       {t('Configure campaign description')}
                      </p>

                      <div className="row g-5">
                        <div className="col-lg-7">
                          <div className="mb-4">
                            <CFormLabel className="fw-bold text-dark mb-2">
                              {values.scopeType === 'product'
                                ? t('Select Products')
                                : t('Select Categories')}

                            </CFormLabel>
                            {values.scopeType === 'product' ? (
                              <>
                                <Select
                                  isMulti
                                  options={productOptions}
                                  placeholder={t('Search and select products')}
                                  value={productOptions.filter((p) =>
                                    values.productIds.includes(p.value),
                                  )}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderRadius: '12px',
                                      padding: '6px',
                                      borderColor: '#e2e8f0',
                                      boxShadow: 'none',
                                      '&:hover': { borderColor: '#cbd5e1' },
                                    }),
                                  }}
                                  onChange={(v) =>
                                    setFieldValue('productIds', v ? v.map((i) => i.value) : [])
                                  }
                                />
                                <ErrorMessage
                                  name="productIds"
                                  component="div"
                                  className="text-danger small mt-1"
                                />
                              </>
                            ) : (
                              <>
                                <Select
                                  options={categoryOptions}
                                  placeholder="Search and select categories..."
                                  isMulti
                                  value={categoryOptions.filter((c) =>
                                    values.categoryIds.includes(c.value),
                                  )}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderRadius: '12px',
                                      padding: '6px',
                                      borderColor: '#e2e8f0',
                                      boxShadow: 'none',
                                      '&:hover': { borderColor: '#cbd5e1' },
                                    }),
                                  }}
                                  onChange={(v) =>
                                    setFieldValue('categoryIds', v ? v.map((i) => i.value) : [])
                                  }
                                />
                                <ErrorMessage
                                  name="categoryIds"
                                  component="div"
                                  className="text-danger small mt-1"
                                />
                              </>
                            )}
                          </div>

                          <div className="mb-4">
                            <CFormLabel className="fw-bold text-dark mb-2">{t('Start Date')}</CFormLabel>
                            <Field name="startDate">
                              {({ field }) => (
                                <CFormInput
                                  {...field}
                                  type="date"
                                  placeholder={t('Date Placeholder')}
                                  min={new Date().toISOString().split('T')[0]}
                                  style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="startDate"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>

                        <div className="col-lg-5">
                          <div
                            className="p-4 rounded-4"
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                          >
                            <h5 className="fw-bold mb-4">{t('Order Summary')}</h5>
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                              <span>{t('Campaign Type')}</span>
                              <span className="fw-semibold text-dark">{t(selectedBoost.label)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                              <span>{t('Duration')}</span>
                              <span className="fw-semibold text-dark">{values.duration}{t('Per Day')} </span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                              <span>{t('Daily Rate')}</span>
                              <span className="fw-semibold text-dark">
                                {selectedBoost?.pricePerDay}  {t('Currency')}
                              </span>
                            </div>

                            <div className="border-top my-3 border-dashed"></div>

                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-dark fs-5">{t('Total Est.')}</span>
                              <span className="fw-bold text-primary fs-4">
                                {totalPrice.toLocaleString()}  {t('Currency')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                        <CButton
                          type="button"
                          variant="ghost"
                          onClick={() => setStep(1)}
                          className="text-secondary fw-semibold px-4"
                        >
                         {t('Back')}
                        </CButton>
                        <CButton
                          type="submit"
                          disabled={loading}
                          className="btn-lg text-white border-0 shadow-lg px-5 rounded-pill"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          }}
                        >
                          <Save size={20} className="me-2" />
                         {t('Activate Campaign')}
                        </CButton>
                      </div>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default BoostForm
