import React, { useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage } from '../../redux/slice/languageSlice'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
  cilChatBubble,
  cilLanguage,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { fetchVendorProfile } from '../../redux/slice/profile'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const handleLogout = () => {
    localStorage.removeItem('token') // or whatever key you're using
    toast.success('Logged out successfully')
    navigate('/', { replace: true }) // Redirect to homepage or login
  }
  const {
    vendor,
    status: profileStatus = 'idle',
    error: profileError,
  } = useSelector((state) => state.vendorProfile.profile || {})
  const dispatch = useDispatch()
  const { lang } = useSelector((state) => state.language)
  useEffect(() => {
    dispatch(fetchVendorProfile())
  }, [dispatch])
  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    dispatch(setLanguage(newLang))
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {vendor?.profilePicture ? (
          <div
            style={{
              width: '40px', // size of avatar
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #0b737f',
              backgroundImage: `url(${vendor.profilePicture || avatar8})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              overflow: 'hidden',
            }}
          ></div>
        ) : (
          <CAvatar
            size="md"
            style={{
              border: '2px solid #0b737f',
              borderRadius: '50%',
            }}
          >
            <CIcon icon={cilUser} />
          </CAvatar>
        )}
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {t('account')}
        </CDropdownHeader>

        <CDropdownItem href="/dashboard/profile">
          <CIcon icon={cilUser} className="me-2" />
          {t('profile')}
        </CDropdownItem>
        <CDropdownItem href="/dashboard/chat">
          <CIcon icon={cilChatBubble} className="me-2" />
          {t('chat_with_us')}
        </CDropdownItem>
        <CDropdownItem onClick={toggleLanguage}>
          <CIcon icon={cilLanguage} className="me-2" />
          {lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {t('logout')}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
