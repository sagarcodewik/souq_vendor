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
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilMenu, cilCheck } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { set } from '../redux/slice/uiSlice'
import { useTranslation } from 'react-i18next'
import { markAsRead, markAllAsRead } from '../redux/slice/notificationSlice'

const AppHeader = () => {
  const headerRef = useRef()
  const { t } = useTranslation('common')
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredNotification, setHoveredNotification] = useState(null)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)

  // 🔔 Redux notifications
  const notifications = useSelector((state) => state.notifications.items)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  // 🔹 Mark all as read when dropdown closes
  const handleDropdownClose = () => {
    if (unreadCount > 0) {
      dispatch(markAllAsRead())
    }
  }

  // 🔹 Mark single as read
  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation()
    dispatch(markAsRead(notificationId))
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  // 🔹 Manual button for mark all
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type, isRead) => {
    if (isRead) return 'text-muted'
    switch (type) {
      case 'success':
        return 'text-success'
      case 'warning':
        return 'text-warning'
      case 'error':
        return 'text-danger'
      case 'info':
        return 'text-info'
      default:
        return 'text-primary'
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))

    if (diffInMinutes < 1) return t('just_now')
    if (diffInMinutes < 60) return `${diffInMinutes}${t('minutes_ago')}`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${t('hours_ago')}`
    return `${Math.floor(diffInMinutes / 1440)}${t('days_ago')}`
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch(set({ sidebarShow: !sidebarShow }))}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              <span className="ms-2 fw-bold fs-5">{t('dashboard')}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className="ms-auto">
          {/* 🔔 Notifications Dropdown */}
          <CDropdown variant="nav-item" placement="bottom-end" onHide={handleDropdownClose}>
            <CDropdownToggle
              caret={false}
              className="py-0 position-relative border-0 bg-transparent"
              style={{
                transition: 'all 0.3s ease',
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <div className="position-relative d-flex align-items-center justify-content-center">
                <CIcon
                  icon={cilBell}
                  size="lg"
                  className={`transition-all ${unreadCount > 0 ? 'text-primary' : 'text-muted'}`}
                  style={{
                    filter:
                      unreadCount > 0 ? 'drop-shadow(0 0 8px rgba(13, 110, 253, 0.3))' : 'none',
                    animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                  }}
                />
                {unreadCount > 0 && (
                  <CBadge
                    color="danger"
                    shape="rounded-pill"
                    className="position-absolute"
                    style={{
                      top: '-8px',
                      right: '-8px',
                      fontSize: '0.65rem',
                      minWidth: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 2px var(--cui-body-bg)',
                      animation: 'bounce 1s infinite',
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </CBadge>
                )}
              </div>
            </CDropdownToggle>

            <CDropdownMenu
              className="shadow-lg border-0"
              style={{
                width: '420px',
                maxHeight: '500px',
                borderRadius: '16px',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Header Section */}
              <div
                className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light bg-opacity-50"
                style={{ borderRadius: '16px 16px 0 0' }}
              >
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ fontSize: '1.2em' }}>
                    🔔
                  </div>
                  <h6 className="mb-0 fw-bold text-dark">{t('notifications')}</h6>
                  {unreadCount > 0 && (
                    <CBadge color="primary" className="ms-2">
                      {unreadCount} {t('new')}
                    </CBadge>
                  )}
                </div>

                <div className="d-flex gap-1">
                  {unreadCount > 0 && (
                    <CButton
                      color="success"
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="p-1"
                      style={{ borderRadius: '8px' }}
                    >
                      <CIcon icon={cilCheck} size="sm" />
                    </CButton>
                  )}
                  {/* <CButton
                    color="secondary"
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    style={{ borderRadius: '8px' }}
                  >
                    <CIcon icon={cilSettings} size="sm" />
                  </CButton> */}
                </div>
              </div>

              {/* Notifications List */}
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '3em', opacity: 0.3 }}>
                      🔕
                    </div>
                    <p className="text-muted mb-2">{t('no_notifications')}</p>
                    <small className="text-muted">{t('all_caught_up')}</small>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <CDropdownItem
                      key={notification._id}
                      className={`position-relative p-0 border-0 ${!notification.isRead ? 'bg-primary bg-opacity-5' : ''}`}
                      onMouseEnter={() => setHoveredNotification(notification._id)}
                      onMouseLeave={() => setHoveredNotification(null)}
                      style={{
                        borderRadius: '0',
                        borderBottom:
                          index < notifications.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.3s ease',
                        transform:
                          hoveredNotification === notification._id
                            ? 'translateX(4px)'
                            : 'translateX(0)',
                      }}
                    >
                      <div className="d-flex align-items-start p-3 w-100">
                        {/* Notification Icon & Indicator */}
                        <div className="me-3 position-relative">
                          <div
                            className={`d-flex align-items-center justify-content-center rounded-circle ${getNotificationColor(notification.type, notification.isRead)}`}
                            style={{
                              width: '40px',
                              height: '40px',
                              fontSize: '1.2em',
                              background: !notification.isRead
                                ? 'rgba(13, 110, 253, 0.1)'
                                : 'rgba(108, 117, 125, 0.1)',
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>
                          {!notification.isRead && (
                            <div
                              className="position-absolute bg-primary rounded-circle"
                              style={{
                                width: '8px',
                                height: '8px',
                                top: '2px',
                                right: '2px',
                                animation: 'pulse 1.5s infinite',
                              }}
                            />
                          )}
                        </div>

                        {/* Notification Content */}
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex align-items-start justify-content-between mb-1">
                            <h6
                              className={`mb-1 fw-semibold ${notification.isRead ? 'text-muted' : 'text-dark'}`}
                              style={{ fontSize: '0.9rem', lineHeight: '1.3' }}
                            >
                              {notification.title}
                            </h6>
                            <small
                              className={`text-nowrap ms-2 ${notification.isRead ? 'text-muted' : 'text-primary'}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {formatTimeAgo(notification.createdAt)}
                            </small>
                          </div>

                          {notification.message && (
                            <p
                              className="mb-2 text-muted small"
                              style={{ fontSize: '0.8rem', lineHeight: '1.4' }}
                            >
                              {notification.message.length > 80
                                ? `${notification.message.substring(0, 80)}...`
                                : notification.message}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div
                            className={`d-flex gap-1 ${hoveredNotification === notification._id ? 'opacity-100' : 'opacity-0'}`}
                            style={{ transition: 'opacity 0.3s ease' }}
                          >
                            {!notification.isRead && (
                              <CButton
                                color="success"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                className="p-1 px-2"
                                style={{ borderRadius: '6px', fontSize: '0.7rem' }}
                              >
                                <CIcon icon={cilCheck} size="sm" className="me-1" />
                                {t('mark_read')}
                              </CButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </CDropdownItem>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div
                  className="p-3 border-top bg-light bg-opacity-50 text-center"
                  style={{ borderRadius: '0 0 16px 16px' }}
                >
                  <CButton
                    color="primary"
                    variant="ghost"
                    size="sm"
                    className="fw-semibold"
                    style={{ borderRadius: '8px' }}
                  >
                    {t('view_all_notifications')}
                  </CButton>
                </div>
              )}
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .dropdown-menu {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        }

        .dropdown-item:hover {
          background-color: rgba(13, 110, 253, 0.05) !important;
        }

        .transition-all {
          transition: all 0.3s ease !important;
        }
      `}</style>
    </CHeader>
  )
}

export default AppHeader
