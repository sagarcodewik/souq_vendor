import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { fetchChatUsersByUserId, fetchMessagesByChatId } from '../../../redux/slice/chat'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CAvatar,
  CSpinner,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilChatBubble, cilPeople, cilEnvelopeClosed, cilFilter } from '@coreui/icons'
import { ROLE_NAMES } from '../../../utils/constants'
import ChatBox from '../../../components/ChatBox'
import styles from './chat.module.scss'
import { useTranslation } from 'react-i18next'

const Chats = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation('orderchats')
  const [userId, setUserId] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all')
  const [filterOrder, setFilterOrder] = useState('all')

  const chatUsers = useSelector((state) => state.chat.chatUsers || [])
  const { fetchStatus, error } = useSelector((state) => state.chat)
  const messages = useSelector((state) => state.chat.messages)

  // Get unique roles and order numbers for filters
  const uniqueRoles = [...new Set(chatUsers.map((user) => user.role))].sort()
  const uniqueOrderNumbers = [
    ...new Set(chatUsers.filter((user) => user.orderNumber).map((user) => user.orderNumber)),
  ].sort()

  // Filter chat users based on selected filters
  const filteredChatUsers = chatUsers.filter((user) => {
    const roleMatch = filterRole === 'all' || user.role.toString() === filterRole
    const orderMatch = filterOrder === 'all' || user.orderNumber === filterOrder
    return roleMatch && orderMatch
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const uid = decoded._id || decoded.id
        setUserId(uid)
        dispatch(fetchChatUsersByUserId({ userId: uid, type: 'order' })).finally(() =>
          setLoading(false),
        )
      } catch (err) {
        console.error('Invalid token:', err)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [dispatch])

  const getRoleBadge = (role) => {
    const roleConfig = {
  admin: { color: 'danger', textKey: 'Admin' },
  vendor: { color: 'primary', textKey: 'Vendor' },
  customer: { color: 'success', textKey: 'Customer' },
  support: { color: 'info', textKey: 'Support' },
  moderator: { color: 'warning', textKey: 'Moderator' },
}

      const config = roleConfig[role] || {
    color: 'secondary',
    textKey: ROLE_NAMES[role] || 'Unknown',
  }

  return (
    <CBadge color={config.color} size="sm">
      {t(config.textKey)}
    </CBadge>
  )
}

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    dispatch(fetchMessagesByChatId(chat.chatId))
  }

  const getDisplayName = (user) => {
    if (user.email === 'marketadmin@yopmail.com') return 'Admin'
    return user.name || 'Unknown User'
  }

const getChatIdentifier = (user) => {
  const roleLabel = t(ROLE_NAMES[user.role] || user.role)

  if (user.orderNumber) {
    return `${getDisplayName(user)} - ${user.orderNumber} (${roleLabel})`
  }

  return `${getDisplayName(user)} (${roleLabel})`
}
  return (
    <div className={styles.chatContainer}>
      {/* LEFT SIDE - Chat Users */}
      <div className={styles.leftSide}>
        <CCard className="h-100 shadow-sm border-0">
          <CCardHeader className={`${styles.chatHeader} bg-primary text-white border-0`}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <CIcon icon={cilChatBubble} className="me-2" size="lg" />
                <div>
                  <h5 className="text-white mb-0">{t("Order Messages")}</h5>
                  <small className="text-white-75">
                    {filteredChatUsers.length} {t("conversation")}
                    {filteredChatUsers.length !== 1 ? 's' : ''}
                  </small>
                </div>
              </div>
              <CIcon icon={cilFilter} className="text-white-75" />
            </div>
          </CCardHeader>

          {/* Filters */}
          <div className="p-3 border-bottom bg-light">
            <div className="row g-2">
              <div className="col-12">
                <label className="form-label small text-muted mb-1">{t("Filter by Role")}</label>
                <CFormSelect
                  size="sm"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">{t("All Roles")}</option>
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {t(ROLE_NAMES[role] || role)}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              {uniqueOrderNumbers.length > 0 && (
                <div className="col-12">
                  <label className="form-label small text-muted mb-1">{t('Filter by Order')}</label>
                  <CFormSelect
                    size="sm"
                    value={filterOrder}
                    onChange={(e) => setFilterOrder(e.target.value)}
                  >
                    <option value="all">{t('All Orders')}</option>
                    {uniqueOrderNumbers.map((orderNumber) => (
                      <option key={orderNumber} value={orderNumber}>
                        {orderNumber}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              )}
            </div>
          </div>

          <CCardBody className="p-0">
            {loading ? (
              <div className={styles.loadingState}>
                <CSpinner color="primary" />
                <p className="text-muted mt-2">{t("Loading conversations...")}</p>
              </div>
            ) : error ? (
              <CAlert color="danger" className="m-3">
                <h6 className="alert-heading">{t('Error loading chats')}</h6>
                {error}
              </CAlert>
            ) : filteredChatUsers.length > 0 ? (
              <div className={styles.usersList}>
                {filteredChatUsers.map((user) => (
                  <div
                    key={`${user._id}-${user.chatId}-${user.orderNumber || 'general'}`}
                    className={`${styles.userCard} ${selectedChat?.chatId === user.chatId ? styles.active : ''}`}
                    onClick={() => handleChatSelect(user)}
                  >
                    <div className={styles.userAvatarContainer}>
                      {user.email === 'marketadmin@yopmail.com' ? (
                        <CAvatar src="/logo.png" size="lg" className={styles.adminAvatar} />
                      ) : user.image ? (
                        <CAvatar src={user.image} size="lg" className={styles.userAvatar} />
                      ) : (
                        <CAvatar size="lg" color="secondary" className={styles.userAvatar}>
                          <CIcon icon={cilUser} />
                        </CAvatar>
                      )}
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.userInfo}>
                        <h6 className={styles.userName}>{getChatIdentifier(user)}</h6>
                        <div className={styles.userMeta}>
                          <small className={styles.userEmail}>
                            <CIcon icon={cilEnvelopeClosed} className="me-1" />
                            {user.email}
                          </small>
                          {user.orderNumber && (
                            <small className={`${styles.orderNumber} text-primary`}>
                              {t('Order')}: {user.orderNumber}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className={styles.userBadge}>{getRoleBadge(user.role)}</div>
                    </div>

                    <div className={styles.chatIndicator}>
                      <CIcon icon={cilChatBubble} className="text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <CIcon icon={cilPeople} size="3xl" className="text-muted mb-3" />
                <h6 className="text-muted mb-2">{t("No conversations found")}</h6>
                <p className="text-muted small mb-0">
                  {chatUsers.length > 0
                    ? 'Try changing your filters'
                    : 'Start chatting with customers, vendors and delivery agents'}
                </p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </div>

      {/* RIGHT SIDE - Chat Area */}
      <div className={styles.rightSide}>
        <CCard className="h-100 shadow-sm border-0">
          {selectedChat ? (
            <>
              <CCardHeader className="bg-light border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className={styles.userAvatarContainer}>
                    {selectedChat.email === 'marketadmin@yopmail.com' ? (
                      <CAvatar src="/logo.png" size="lg" className={styles.adminAvatar} />
                    ) : selectedChat.image ? (
                      <CAvatar src={selectedChat.image} size="lg" className={styles.userAvatar} />
                    ) : (
                      <CAvatar size="lg" color="secondary" className={styles.userAvatar}>
                        <CIcon icon={cilUser} />
                      </CAvatar>
                    )}
                  </div>

                  <div>
                    <h6 className={styles.userName}>{getChatIdentifier(selectedChat)}</h6>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <small className="text-muted">{selectedChat.email}</small>
                      {getRoleBadge(selectedChat.role)}
                      {selectedChat.orderNumber && (
                        <CBadge color="info" size="sm">
                          Order: {selectedChat.orderNumber}
                        </CBadge>
                      )}
                    </div>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody className={styles.chatArea}>
                <ChatBox
                  chatId={selectedChat.chatId}
                  currentUserId={userId}
                  receiverId={selectedChat._id}
                  orderNumber={selectedChat.orderNumber}
                />
              </CCardBody>
            </>
          ) : (
            <CCardBody className={styles.chatArea}>
              <div className={styles.emptyMessage}>
                <CIcon icon={cilChatBubble} size="4xl" className="text-muted mb-4" />
                <h4 className="text-muted mb-3">{t("Select a conversation")}</h4>
                <p className="text-muted">{t('Choose a contact from the sidebar to start messaging')}</p>
              </div>
            </CCardBody>
          )}
        </CCard>
      </div>
    </div>
  )
}

export default Chats
