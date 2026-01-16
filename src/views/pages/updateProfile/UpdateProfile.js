import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Select from 'react-select'

import { CButton, CFormInput, CFormTextarea } from '@coreui/react'
import { ProfileUpdatevalidationSchema } from '../../../utils/validations'
import {
  fetchVendorProfile,
  updateVendorProfile as saveVendorThunk,
} from '../../../redux/slice/profile'
import Loader from '../../../components/loader/loader'
import { CATEGORY_OPTIONS } from '../../../utils/constants'
import styles from './updateProfile.module.scss'

const UserIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const BuildingIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const HashIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
    />
  </svg>
)

const CreditCardIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const UploadIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const FileTextIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const CameraIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const SaveIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
)

const reverseGeocode = async (lat, lng) => {
  const resp = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API}`,
  )
  const data = await resp.json()
  const result = data.results?.[0]
  if (!result) return { formatted: '', city: '', state: '', country: '' }

  const comps = result.address_components
  const find = (type) => comps.find((c) => c.types.includes(type))?.long_name || ''
  return {
    formatted: result.formatted_address,
    city: find('locality') || find('administrative_area_level_2'),
    state: find('administrative_area_level_1'),
    country: find('country'),
  }
}

const UpdateProfile = () => {
  const dispatch = useDispatch()
  const { vendor, status } = useSelector(
    (s) => s.vendorProfile?.profile || { vendor: null, status: 'idle' },
  )

  const [coords, setCoords] = useState([0, 0])
  const [addressStr, setAddressStr] = useState('')
  const [city, setCity] = useState('')
  const [stateProv, setStateProv] = useState('')
  const [country, setCountry] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherCategoryValue, setOtherCategoryValue] = useState('')
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [gpsError, setGpsError] = useState('')

  useEffect(() => {
    dispatch(fetchVendorProfile())
  }, [dispatch])
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error')
      setGpsError('Geolocation is not supported by your browser')
      return
    }

    setGpsStatus('loading')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          setCoords([longitude, latitude])

          const geo = await reverseGeocode(latitude, longitude)
          setAddressStr(geo.formatted)
          setCity(geo.city)
          setStateProv(geo.state)
          setCountry(geo.country)

          setGpsStatus('success')
          setGpsError('')
        } catch (error) {
          console.error('Geocoding error:', error)
          setGpsStatus('error')
          setGpsError('Failed to fetch address. You can still proceed.')
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setGpsStatus('error')

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('Location permission denied. Please enable GPS in your browser settings.')
            break
          case error.POSITION_UNAVAILABLE:
            setGpsError('Location unavailable. Please check your GPS settings.')
            break
          case error.TIMEOUT:
            setGpsError('Location request timed out. Please try again.')
            break
          default:
            setGpsError('An unknown error occurred while fetching location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])
  const retryGPS = () => {
    setGpsStatus('idle')
    setGpsError('')
    window.location.reload()
  }

  if (status === 'loading' || !vendor) {
    return (
      <div className={styles.loadingContainer}>
        <Loader />
      </div>
    )
  }

  const initialValues = {
    businessName: vendor.businessName || '',
    ownerName: vendor.ownerName || '',
    commercialRegNo: vendor.commercialRegNo || '',
    vatOrTaxId: vendor.vatOrTaxId || '',
    nationalIdNumber: vendor.nationalIdNumber || '',
    businessPhone: vendor.businessPhone || '',
    whatsappNumber: vendor.whatsappNumber || '',
    category: vendor.category || [],
    licenseDocument: vendor.licenseDocument || undefined,
    profilePicture: vendor.profilePicture || undefined,
    bankOrMobilePayInfo: vendor.bankOrMobilePayInfo || '',
  }

  const saveProfile = async (values, setSubmitting) => {
    console.log('SUBMIT VALUES:', values)
    console.log('COORDS:', coords)
    console.log('GPS STATUS:', gpsStatus)

    const formData = new FormData()
    const validCoords =
      Array.isArray(coords) &&
      coords.length === 2 &&
      coords.every((n) => typeof n === 'number' && !isNaN(n))
    if (gpsStatus === 'success' && !validCoords) {
      alert('Invalid location coordinates. Please refresh and try again.')
      setSubmitting(false)
      return
    }
    const finalCoords = validCoords && coords[0] !== 0 && coords[1] !== 0 ? coords : [0, 0]

    formData.append('businessName', values.businessName)
    formData.append('ownerName', values.ownerName)
    formData.append('commercialRegNo', values.commercialRegNo)
    formData.append('vatOrTaxId', values.vatOrTaxId)
    formData.append('nationalIdNumber', values.nationalIdNumber)
    formData.append('businessPhone', values.businessPhone)
    formData.append('whatsappNumber', values.whatsappNumber)
    formData.append('bankOrMobilePayInfo', values.bankOrMobilePayInfo)
    formData.append('category', JSON.stringify(values.category))
    if (values.licenseDocument && typeof values.licenseDocument === 'object') {
      formData.append('License', values.licenseDocument)
    }
    if (values.profilePicture && typeof values.profilePicture === 'object') {
      formData.append('profilePicture', values.profilePicture)
    }
    formData.append('location', JSON.stringify({ type: 'Point', coordinates: finalCoords }))
    formData.append(
      'address',
      JSON.stringify({ street: addressStr, city, state: stateProv, country }),
    )
    try {
      await dispatch(saveVendorThunk(formData)).unwrap()
      dispatch(fetchVendorProfile())
      handleLogout()
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/', { replace: true })
  }

  const handleOtherCategorySubmit = (setFieldValue, values) => {
    if (otherCategoryValue.trim()) {
      const updatedCategories = values.category.filter((cat) => cat !== 'Other')
      updatedCategories.push(otherCategoryValue.trim())
      setFieldValue('category', updatedCategories)
      setShowOtherInput(false)
      setOtherCategoryValue('')
    }
  }

  const removeCategory = (categoryToRemove, setFieldValue, values) => {
    const updatedCategories = values.category.filter((cat) => cat !== categoryToRemove)
    setFieldValue('category', updatedCategories)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {gpsStatus === 'loading' && (
          <div
            style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #f59e0b',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span>Detecting your location...</span>
          </div>
        )}

        {gpsStatus === 'error' && (
          <div
            style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
            }}
          >
            <p style={{ color: '#991b1b', marginBottom: '8px' }}>{gpsError}</p>
            <button
              type="button"
              onClick={retryGPS}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry GPS
            </button>
          </div>
        )}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ProfileUpdatevalidationSchema}
          onSubmit={(vals, helpers) => {
            console.log('Form submitted:', vals)
            console.log('Validation errors:', helpers.errors)
            saveProfile(vals, helpers.setSubmitting)
          }}
        >
          {({ isSubmitting, touched, errors, values, setFieldValue, setFieldTouched }) => {
            return (
              <Form>
                {/* ... rest of your form fields remain the same ... */}
                {/* Profile Image Section */}
                <div className={styles.profileImageSection}>
                  <div className={styles.profileImageWrapper}>
                    {vendor.profilePicture ||
                    (values.profilePicture && typeof values.profilePicture === 'object') ? (
                      <img
                        src={
                          values.profilePicture && typeof values.profilePicture === 'object'
                            ? URL.createObjectURL(values.profilePicture)
                            : vendor.profilePicture
                        }
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    ) : (
                      <div className={styles.defaultProfileImage}>
                        <UserIcon />
                      </div>
                    )}
                    <div className={styles.editProfileButton}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0]
                          if (file) {
                            setFieldValue('profilePicture', file)
                          }
                        }}
                        className={styles.fileInput}
                        id="profile-image-edit"
                      />
                      <label htmlFor="profile-image-edit" className={styles.editIcon}>
                        <CameraIcon />
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <BuildingIcon />
                    <h2 className={styles.sectionTitle}>Business Information</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.fieldsGrid}>
                      {[
                        { name: 'businessName', label: 'Business Name', icon: BuildingIcon },
                        { name: 'ownerName', label: 'Owner Name', icon: UserIcon },
                        { name: 'commercialRegNo', label: 'Commercial Reg No.', icon: HashIcon },
                        { name: 'vatOrTaxId', label: 'VAT/Tax ID', icon: HashIcon },
                        { name: 'nationalIdNumber', label: 'National ID Number', icon: HashIcon },
                      ].map(({ name, label, icon: IconComponent }) => (
                        <div key={name} className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>{label}</label>
                          <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                              <IconComponent />
                            </div>
                            <Field
                              as={CFormInput}
                              name={name}
                              type="text"
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className={`${styles.formInput} ${touched[name] && errors[name] ? styles.inputError : ''}`}
                            />
                          </div>
                          <div className={styles.errorMessage}>
                            <ErrorMessage name={name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <PhoneIcon />
                    <h2 className={styles.sectionTitle}>Contact Information</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.fieldsGrid}>
                      {[
                        { name: 'businessPhone', label: 'Business Phone' },
                        { name: 'whatsappNumber', label: 'WhatsApp Number' },
                      ].map(({ name, label }) => (
                        <div key={name} className={styles.fieldGroup}>
                          <label className={styles.fieldLabel}>{label}</label>
                          <div className={styles.inputWrapper}>
                            <div className={styles.inputIcon}>
                              <PhoneIcon />
                            </div>
                            <Field
                              as={CFormInput}
                              name={name}
                              type="tel"
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className={`${styles.formInput} ${touched[name] && errors[name] ? styles.inputError : ''}`}
                            />
                          </div>
                          <div className={styles.errorMessage}>
                            <ErrorMessage name={name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <CreditCardIcon />
                    <h2 className={styles.sectionTitle}>Payment Information</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Bank/Mobile Payment Info</label>
                      <div className={styles.inputWrapper}>
                        <div className={styles.inputIcon}>
                          <CreditCardIcon />
                        </div>
                        <Field
                          as={CFormInput}
                          name="bankOrMobilePayInfo"
                          type="text"
                          placeholder="Enter bank or mobile payment information"
                          className={`${styles.formInput} ${touched.bankOrMobilePayInfo && errors.bankOrMobilePayInfo ? styles.inputError : ''}`}
                        />
                      </div>
                      <div className={styles.errorMessage}>
                        <ErrorMessage name="bankOrMobilePayInfo" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection} style={{ overflow: 'unset' }}>
                  <div className={styles.sectionHeader}>
                    <BuildingIcon />
                    <h2 className={styles.sectionTitle}>Business Categories</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Select Business Categories</label>
                      <Select
                        isMulti
                        name="category"
                        options={[
                          ...CATEGORY_OPTIONS.map((cat) => ({ value: cat, label: cat })),
                          { value: 'Other', label: 'Other' },
                        ]}
                        value={values.category.map((cat) => ({ value: cat, label: cat }))}
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions
                            ? selectedOptions.map((opt) => opt.value)
                            : []
                          setFieldValue('category', selectedValues)
                          setFieldTouched('category', true, false)
                          if (selectedValues.includes('Other')) {
                            setShowOtherInput(true)
                          } else {
                            setShowOtherInput(false)
                            setOtherCategoryValue('')
                          }
                        }}
                        classNamePrefix="select"
                        className={`${styles.categorySelect} ${touched.category && errors.category ? styles.selectError : ''}`}
                        placeholder="Choose business categories..."
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            minHeight: '2.5rem',
                            fontSize: '0.8rem',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#d1d5db',
                            },
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: '#f1f5f9',
                            borderRadius: '0.375rem',
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color: '#334155',
                            fontSize: '0.75rem',
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#64748b',
                            '&:hover': {
                              backgroundColor: '#e2e8f0',
                              color: '#1e293b',
                            },
                          }),
                        }}
                      />
                      {showOtherInput && (
                        <div className={styles.otherCategoryWrapper}>
                          <label className={styles.fieldLabel}>Specify Other Category</label>
                          <div className={styles.otherCategoryInputWrapper}>
                            <div className={styles.inputWrapper}>
                              <div className={styles.inputIcon}>
                                <BuildingIcon />
                              </div>
                              <input
                                type="text"
                                value={otherCategoryValue}
                                onChange={(e) => setOtherCategoryValue(e.target.value)}
                                placeholder="Enter your business category"
                                className={styles.otherCategoryInput}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOtherCategorySubmit(setFieldValue, values)}
                              className={styles.addCategoryButton}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                      {values.category.length > 0 && (
                        <div className={styles.selectedCategoriesWrapper}>
                          <p className={styles.selectedCategoriesLabel}>Selected Categories:</p>
                          <div className={styles.selectedCategories}>
                            {values.category.map((category, index) => (
                              <span key={index} className={styles.categoryTag}>
                                {category}
                                <button
                                  type="button"
                                  onClick={() => removeCategory(category, setFieldValue, values)}
                                  className={styles.categoryTagRemove}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={styles.errorMessage}>
                        <ErrorMessage name="category" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <UploadIcon />
                    <h2 className={styles.sectionTitle}>License Document</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.uploadGroup}>
                      <label className={styles.fieldLabel}>Upload License Document</label>
                      <div className={styles.uploadArea}>
                        <FileTextIcon />
                        <p className={styles.uploadText}>Upload license document (PDF or Image)</p>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0]
                            if (file) {
                              setFieldValue('licenseDocument', file)
                              setFieldTouched('licenseDocument', true, false)
                            }
                          }}
                          className={styles.fileInput}
                          id="license-upload"
                        />
                        <label htmlFor="license-upload" className={styles.uploadButton}>
                          <UploadIcon />
                          Choose File
                        </label>
                        {values.licenseDocument && typeof values.licenseDocument === 'object' && (
                          <p className={styles.fileName}>Selected: {values.licenseDocument.name}</p>
                        )}
                      </div>
                      {values.licenseDocument && typeof values.licenseDocument === 'object' && (
                        <div className={styles.previewContainer}>
                          {values.licenseDocument.type?.startsWith('image') && (
                            <img
                              src={URL.createObjectURL(values.licenseDocument)}
                              alt="License Preview"
                              className={styles.imagePreview}
                            />
                          )}
                          {values.licenseDocument.type === 'application/pdf' && (
                            <button
                              type="button"
                              className={styles.pdfButton}
                              onClick={() => {
                                const blobUrl = URL.createObjectURL(values.licenseDocument)
                                window.open(blobUrl)
                              }}
                            >
                              View PDF
                            </button>
                          )}
                        </div>
                      )}
                      {vendor.licenseDocument && (
                        <div className={styles.existingFile}>
                          <h4 className={styles.existingFileTitle}>Current License Document</h4>
                          {vendor.licenseDocument.includes('.pdf') ? (
                            <a
                              href={vendor.licenseDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.pdfLink}
                            >
                              View License (PDF)
                            </a>
                          ) : (
                            <img
                              src={vendor.licenseDocument}
                              alt="License"
                              className={styles.existingImage}
                            />
                          )}
                        </div>
                      )}
                      <div className={styles.errorMessage}>
                        <ErrorMessage name="licenseDocument" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <MapPinIcon />
                    <h2 className={styles.sectionTitle}>Business Location</h2>
                  </div>

                  <div className={styles.sectionBody}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Current Business Address</label>
                      <div className={styles.inputWrapper}>
                        <div className={styles.inputIcon}>
                          <MapPinIcon />
                        </div>
                        <CFormTextarea
                          value={addressStr}
                          readOnly
                          rows={3}
                          className={styles.addressInput}
                          placeholder="Address will be detected automatically via GPS"
                        />
                      </div>
                      <p className={styles.gpsNote}>
                        Location detected automatically via GPS. Please ensure location services are
                        enabled.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.submitSection}>
                  <CButton type="submit" disabled={isSubmitting} className={styles.submitButton}>
                    {isSubmitting ? (
                      <div className={styles.loadingContent}>
                        <div className={styles.spinner}></div>
                        Saving...
                      </div>
                    ) : (
                      <div className={styles.saveContent}>
                        <SaveIcon />
                        Save Changes
                      </div>
                    )}
                  </CButton>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

export default UpdateProfile
