import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu, cilCheck } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header'
import { set } from '../redux/slice/uiSlice'
import { useTranslation } from 'react-i18next'
import { markAsRead, markAllAsRead } from '../redux/slice/notificationSlice'

const AppHeader = () => {
  const headerRef = useRef()
  const { t } = useTranslation('common')
  const dispatch = useDispatch()

  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredNotification, setHoveredNotification] = useState(null)

  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const notifications = useSelector((state) => state.notifications.items)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const onScroll = () => {
      headerRef.current?.classList.toggle(
        'shadow-sm',
        document.documentElement.scrollTop > 0,
      )
    }
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  const handleDropdownClose = () => unreadCount > 0 && dispatch(markAllAsRead())

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation()
    dispatch(markAsRead(id))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const getNotificationIcon = (type) =>
    ({ success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' }[type] || '🔔')

  const formatTimeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000)
    if (diff < 1) return t('just_now')
    if (diff < 60) return `${diff}${t('minutes_ago')}`
    if (diff < 1440) return `${Math.floor(diff / 60)}${t('hours_ago')}`
    return `${Math.floor(diff / 1440)}${t('days_ago')}`
  }

  return (
    <CHeader position="sticky" className="app-header mb-4 p-0" ref={headerRef}>
      <CContainer fluid className="border-bottom px-3">
        <CHeaderToggler className="px-2 d-md-none" onClick={() => dispatch(set({ sidebarShow: !sidebarShow }))}><CIcon icon={cilMenu} size="lg" /></CHeaderToggler>
        <h3 className="fw-bold fs-5 mb-0 text-black">{t('dashboard')}</h3>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item" placement="bottom-end" onHide={handleDropdownClose}>
            <CDropdownToggle caret={false} className={`notification-toggle ${isAnimating ? 'animate-scale' : ''}`}>
              <CIcon icon={cilBell} size="lg" className={`notification-icon ${unreadCount ? 'active' : ''}`}/>
              {unreadCount > 0 && (
                <CBadge color="danger" className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</CBadge>
              )}
            </CDropdownToggle>

            <CDropdownMenu className="notification-menu">
              <div className="notification-header">
                <h6>{t('notifications')}</h6>
                {unreadCount > 0 && (
                  <CButton size="sm" variant="ghost" onClick={handleMarkAllAsRead}><CIcon icon={cilCheck} /></CButton>
                )}
              </div>

              <div className="notification-list">
                {notifications.map((n) => (
                  <CDropdownItem key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`} onMouseEnter={() => setHoveredNotification(n._id)} onMouseLeave={() => setHoveredNotification(null)}>
                    <div className="notification-content">
                      <div className="notification-icon-circle">{getNotificationIcon(n.type)}</div>
                      <div className="notification-text">
                        <div className="notification-title">
                          <span>{n.title}</span> <small>{formatTimeAgo(n.createdAt)}</small>
                        </div>

                        {n.message && <p>{n.message}</p>}

                        {!n.isRead && hoveredNotification === n._id && (
                          <CButton size="sm" variant="ghost" onClick={(e) => handleMarkAsRead(n._id, e)}><CIcon icon={cilCheck} /> {t('mark_read')}</CButton>
                        )}
                      </div>
                    </div>
                  </CDropdownItem>
                ))}
              </div>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer fluid className="px-3">
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader