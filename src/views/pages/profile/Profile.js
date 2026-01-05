import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchVendorProfile,
  fetchVendorDeliveryHours,
  saveAllVendorDeliveryHours,
  subscribeVendor,
} from '../../../redux/slice/profile'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CFormInput,
  CFormSwitch,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { localTimeFormat, convertLocalTimeToISO, convertLocalTimeToIOS } from '../../../utils'
import { daysOfWeek } from '../../../utils/constants'
import styles from './profile.module.scss'
import Loader from '../../../components/loader/loader'

// Icon Components
const UserIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CrownIcon = () => (
  <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
  </svg>
);

const StarIcon = () => (
  <svg className={styles.smallIcon} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const MailIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CopyIcon = () => (
  <svg className={styles.verySmallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className={styles.verySmallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const getDefaultHours = () => {
  const defaults = {}
  daysOfWeek.forEach(({ key }) => {
    defaults[key] = {
      isOpen: false,
      open: '09:00',
      close: '18:00',
    }
  })
  return defaults
}

const isValidCloseTime = (open, close) => {
  const [openH, openM] = open.split(':').map(Number)
  const [closeH, closeM] = close.split(':').map(Number)
 
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
 
  return closeMinutes > openMinutes && closeMinutes <= 1439 // before 12:00 AM
}
 
const Profile = () => {
  const dispatch = useDispatch()
 
  // ✅ Corrected selector to match the Redux structure
  const { profile = {}, deliveryHours = {} } = useSelector((state) => state.vendor)
  const {
    vendor,
    status: profileStatus = 'idle',
    error: profileError,
  } = useSelector((state) => state.vendorProfile.profile || {})
  const {
    data: deliveryHoursData = [],
    status: hoursStatus = 'idle',
    error: hoursError,
  } = useSelector((state) => state.vendorProfile.deliveryHours || {})
 
  const [businessHours, setBusinessHours] = useState(getDefaultHours)
  const [originalHours, setOriginalHours] = useState(getDefaultHours)
  const [submitting, setSubmitting] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('Monthly')
  const [copiedDay, setCopiedDay] = useState(null)
 
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(fetchVendorProfile())
    dispatch(fetchVendorDeliveryHours())
  }, [dispatch])
 
  useEffect(() => {
    if (hoursStatus === 'succeeded') {
      const formatted = getDefaultHours()
      daysOfWeek.forEach(({ key }) => {
        const found = deliveryHoursData.find((d) => d.day === key)
        if (found) {
          formatted[key] = {
            isOpen: !(found?.isDayOff ?? true),
            open: localTimeFormat(found?.openTime) ?? '09:00',
            close: localTimeFormat(found?.closeTime) ?? '18:00',
          }
        }
      })
      setBusinessHours(formatted)
      setOriginalHours(formatted)
    }
  }, [deliveryHoursData, hoursStatus])
 
  const toggleDay = (day) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }))
  }
 
  const updateTime = (day, type, value) => {
    setBusinessHours((prev) => {
      const updated = {
        ...prev[day],
        [type]: value,
      }
 
      // If type is 'close', validate the time range
      if (type === 'close') {
        const { open } = updated
        if (!isValidCloseTime(open, value)) {
          toast.error('Closing time must be after opening time and before midnight (12:00 AM).')
          return prev
        }
      }
 
      return {
        ...prev,
        [day]: updated,
      }
    })
  }
 
  const copyHoursToAll = (sourceDay) => {
    const source = businessHours[sourceDay]
    const updated = {}
    daysOfWeek.forEach(({ key }) => {
      updated[key] = {
        isOpen: source.isOpen,
        open: source.open,
        close: source.close,
      }
    })
    setBusinessHours(updated)
    setCopiedDay(sourceDay)
    setTimeout(() => setCopiedDay(null), 2000)
  }
 
  const hasChanges = () => {
    return JSON.stringify(businessHours) !== JSON.stringify(originalHours)
  }
 
  const handleUpdate = async () => {
    const payload = []
 
    for (const { key } of daysOfWeek) {
      const bh = businessHours[key]
 
      payload.push({
        day: key,
        isDayOff: !bh.isOpen,
        openTime: convertLocalTimeToIOS(bh.open),
        closeTime: convertLocalTimeToIOS(bh.close),
      })
    }
    console.log('Saving delivery hours payload submit:', payload)
    try {
      await dispatch(saveAllVendorDeliveryHours(payload)).unwrap()
      await dispatch(fetchVendorDeliveryHours()).unwrap()
    } catch (err) {
      // Error handled by Redux or here
      console.error('Failed to save delivery hours:', err)
    }
  }

  const getDaysLeft = () => {
    if (!vendor?.premiumEndDate) return 0;
    return Math.max(0, Math.ceil((new Date(vendor.premiumEndDate) - new Date()) / (1000 * 60 * 60 * 24)));
  };
 
  if (profileStatus === 'loading' || hoursStatus === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <Loader />
      </div>
    )
  }
 
  if (profileStatus === 'failed') {
    return <div className={styles.errorContainer}>{profileError}</div>
  }
 
  if (!vendor) {
    return <div className={styles.noDataContainer}>No profile data found.</div>
  }
 
  if (hoursStatus === 'failed') {
    return (
      <div className={styles.errorContainer}>
        {hoursError || 'Failed to load delivery hours'}
      </div>
    )
  }
 
  return (
    <div className={styles.profilePage}>
      {submitting && <Loader />}
      
      <div className={styles.container}>
        {/* Premium Status Cards */}
        <div className={styles.premiumSection}>
          {!vendor.isPremium && !vendor.hasAppliedForPremium && (
            <div className={styles.premiumCard}>
              <div className={styles.premiumCardContent}>
                <div className={styles.premiumInfo}>
                  <h3 className={styles.premiumTitle}>Upgrade to Premium</h3>
                  <p className={styles.premiumDescription}>
                    Get featured listings, more visibility, and advanced tools to grow your business.
                  </p>
                </div>
                <CrownIcon />
              </div>
              <CButton
                className={styles.premiumButton}
                onClick={() => navigate('/dashboard/profile/upgrade')}
              >
                Apply for Premium
              </CButton>
            </div>
          )}

          {!vendor.isPremium && vendor.hasAppliedForPremium && (
            <div className={styles.reviewCard}>
              <div className={styles.reviewCardContent}>
                <ClockIcon />
                <div>
                  <h3 className={styles.reviewTitle}>Premium Application Under Review</h3>
                  <p className={styles.reviewDescription}>
                    We're processing your premium application. You'll be notified soon!
                  </p>
                </div>
              </div>
            </div>
          )}

          {vendor.isPremium && (
            <div className={styles.activeCard}>
              <div className={styles.activeCardContent}>
                <div className={styles.activeInfo}>
                  <CrownIcon />
                  <div>
                    <h3 className={styles.activeTitle}>
                      Premium Vendor <StarIcon />
                    </h3>
                    <p className={styles.activePlan}>Plan: {vendor.premiumPlan}</p>
                  </div>
                </div>
                <div className={styles.daysCounter}>
                  <div className={styles.daysCounterBox}>
                    <p className={styles.daysLabel}>Days Remaining</p>
                    <p className={styles.daysNumber}>{getDaysLeft()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileHeaderContent}>
              <UserIcon />
              <h2 className={styles.profileHeaderTitle}>Profile Information</h2>
            </div>
            <button 
              className={styles.editButton}
              onClick={() => navigate('/dashboard/profile/profile-update')}
            >
              <EditIcon />
            </button>
          </div>
          
          <div className={styles.profileBody}>
            {/* Profile Picture */}
            <div className={styles.profilePictureSection}>
              <div className={styles.profilePictureWrapper}>
                {vendor.profilePicture ? (
                  <img
                    src={vendor.profilePicture}
                    alt="Profile"
                    className={styles.profilePicture}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = ''
                    }}
                  />
                ) : (
                  <div className={styles.defaultProfilePicture}>
                    <UserIcon />
                  </div>
                )}
                <div className={styles.onlineIndicator}>
                  <div className={styles.onlineDot}></div>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className={styles.profileGrid}>
              <div className={styles.profileColumn}>
                <div className={styles.profileItem}>
                  <BuildingIcon />
                  <div>
                    <p className={styles.profileLabel}>Store Name</p>
                    <p className={styles.profileValue}>{vendor.businessName}</p>
                  </div>
                </div>
                
                <div className={styles.profileItem}>
                  <UserIcon />
                  <div>
                    <p className={styles.profileLabel}>Owner Name</p>
                    <p className={styles.profileValue}>{vendor.ownerName}</p>
                  </div>
                </div>

                <div className={styles.profileItem}>
                  <MailIcon />
                  <div>
                    <p className={styles.profileLabel}>Email</p>
                    <p className={styles.profileValue}>{vendor.userId?.email}</p>
                  </div>
                </div>

                <div className={styles.profileItem}>
                  <PhoneIcon />
                  <div>
                    <p className={styles.profileLabel}>Business Phone</p>
                    <p className={styles.profileValue}>{vendor.businessPhone}</p>
                  </div>
                </div>
              </div>

              <div className={styles.profileColumn}>
                <div className={styles.profileItem}>
                  <PhoneIcon />
                  <div>
                    <p className={styles.profileLabel}>WhatsApp</p>
                    <p className={styles.profileValue}>{vendor.whatsappNumber}</p>
                  </div>
                </div>

                <div className={styles.profileItem}>
                  <StarIcon />
                  <div>
                    <p className={styles.profileLabel}>Category</p>
                    <p className={styles.profileValue}>{vendor.category?.join(', ')}</p>
                  </div>
                </div>

                <div className={styles.profileItem}>
                  <MapPinIcon />
                  <div>
                    <p className={styles.profileLabel}>Location</p>
                    <p className={styles.profileValue}>{vendor.address?.city}, {vendor.address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Hours Card */}
        <div className={styles.hoursCard}>
          <div className={styles.hoursHeader}>
            <div className={styles.hoursHeaderContent}>
              <ClockIcon />
              <h2 className={styles.hoursHeaderTitle}>Delivery Hours</h2>
            </div>
          </div>
          
          <div className={styles.hoursBody}>
            <div className={styles.hoursGrid}>
              {daysOfWeek.map(({ key, label }) => {
                const dayData = businessHours[key];
                
                return (
                  <div 
                    key={key} 
                    className={`${styles.dayCard} ${dayData.isOpen ? styles.dayCardOpen : styles.dayCardClosed}`}
                  >
                    <div className={styles.dayCardContent}>
                      <div className={styles.dayInfo}>
                        <CalendarIcon />
                        <span className={styles.dayName}>{label}</span>
                        
                        {/* Custom Toggle Switch */}
                        <div 
                          className={`${styles.toggle} ${dayData.isOpen ? styles.toggleOn : styles.toggleOff}`}
                          onClick={() => toggleDay(key)}
                        >
                          <div className={styles.toggleDot}></div>
                        </div>
                        
                        <span className={styles.dayStatus}>
                          {dayData.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      {dayData.isOpen && (
                        <div className={styles.timeControls}>
                          <CFormInput
                            type="time"
                            value={dayData.open}
                            onChange={(e) => updateTime(key, 'open', e.target.value)}
                            className={styles.timeInput}
                          />
                          <span className={styles.timeTo}>to</span>
                          <CFormInput
                            type="time"
                            value={dayData.close}
                            onChange={(e) => updateTime(key, 'close', e.target.value)}
                            className={styles.timeInput}
                          />
                          
                          <button
                            onClick={() => copyHoursToAll(key)}
                            className={`${styles.copyButton} ${copiedDay === key ? styles.copyButtonSuccess : ''}`}
                          >
                            {copiedDay === key ? (
                              <>
                                <CheckIcon />
                                Copied!
                              </>
                            ) : (
                              <>
                                <CopyIcon />
                                Copy to all
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={styles.updateSection}>
              <CButton
                className={styles.updateButton}
                onClick={handleUpdate}
                disabled={!hasChanges() || hoursStatus === 'loading'}
              >
                {hoursStatus === 'loading' ? 'Updating...' : 'Update Hours'}
              </CButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Profile