import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { fetchChatUsersByUserId, fetchMessagesByChatId } from '../../../redux/slice/chat'
import { CCard, CCardBody, CCardHeader, CBadge, CAvatar, CSpinner, CAlert } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilChatBubble, cilPeople, cilEnvelopeClosed } from '@coreui/icons'
import { ROLE_NAMES } from '../../../utils/constants'
import ChatBox from '../../../components/ChatBox'
import styles from './chat.module.scss'
import { useTranslation } from 'react-i18next'

const Chats = () => {
  const dispatch = useDispatch()
  const [userId, setUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation('customerchats')

  const chatUsers = useSelector((state) => state.chat.chatUsers || [])
  const { fetchStatus, error } = useSelector((state) => state.chat)
  const messages = useSelector((state) => state.chat.messages)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const uid = decoded._id || decoded.id
        setUserId(uid)
        dispatch(fetchChatUsersByUserId({ userId: uid, role: 1 })).finally(() => setLoading(false))
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
      admin: { color: 'danger', text: 'Admin' },
      vendor: { color: 'primary', text: 'Vendor' },
      customer: { color: 'success', text: 'Customer' },
      support: { color: 'info', text: 'Support' },
      moderator: { color: 'warning', text: 'Moderator' },
    }

    const config = roleConfig[role] || { color: 'secondary', text: ROLE_NAMES[role] || 'Unknown' }
    return (
      <CBadge color={config.color} size="sm">
        {config.text}
      </CBadge>
    )
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    dispatch(fetchMessagesByChatId(user.chatId))
  }

  const getOnlineStatus = () => {
    // This would typically come from socket connection or API
    return Math.random() > 0.5 // Mock online status
  }

  return (
    <div className={styles.chatContainer}>
      {/* LEFT SIDE - Chat Users */}
      <div className={styles.leftSide}>
        <CCard className="h-100 shadow-sm border-0">
          <CCardHeader className={`${styles.chatHeader} bg-primary text-white border-0`}>
            <div className="d-flex align-items-center">
              <CIcon icon={cilChatBubble} className="me-2" size="lg" />
              <div>
                <h5 className="text-white mb-0">{t("Messages")}</h5>
                <small className="text-white-75">
                  {chatUsers.length} {t('conversation')}{chatUsers.length !== 1 ? 's' : ''}
                </small>
              </div>
            </div>
          </CCardHeader>

          <CCardBody className="p-0">
            {loading ? (
              <div className={styles.loadingState}>
                <CSpinner color="primary" />
                <p className="text-muted mt-2">{t("Loading conversations...")}</p>
              </div>
            ) : error ? (
              <CAlert color="danger" className="m-3">
                <h6 className="alert-heading">{t("Error loading chats")}</h6>
                {error}
              </CAlert>
            ) : chatUsers.length > 0 ? (
              <div className={styles.usersList}>
                {chatUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`${styles.userCard} ${selectedUser?._id === user._id ? styles.active : ''}`}
                    onClick={() => handleUserSelect(user)}
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
                      {/* <div
                        className={`${styles.onlineIndicator} ${getOnlineStatus() ? styles.online : styles.offline}`}
                      >
                        <CIcon icon={cilCircle} size="sm" />
                      </div> */}
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.userInfo}>
                        <h6 className={styles.userName}>
                          {' '}
                          {user.email === 'marketadmin@yopmail.com'
                            ? 'Admin'
                            : user.name || 'Unknown User'}
                        </h6>
                        <div className={styles.userMeta}>
                          <small className={styles.userEmail}>
                            <CIcon icon={cilEnvelopeClosed} className="me-1" />
                            {user.email}
                          </small>
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
                <h6 className="text-muted mb-2">{t('No conversations yet')}</h6>
                <p className="text-muted small mb-0">
                  {t('Start chatting with customers, Vendor and Delivery Agents')}
                </p>
              </div>
            )}
          </CCardBody>
        </CCard>
      </div>

      {/* RIGHT SIDE - Chat Area */}
      <div className={styles.rightSide}>
        <CCard className="h-100 shadow-sm border-0">
          {selectedUser ? (
            <>
              <CCardHeader className="bg-light border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className={styles.userAvatarContainer}>
                    {selectedUser.email === 'marketadmin@yopmail.com' ? (
                      <CAvatar src="/logo.png" size="lg" className={styles.adminAvatar} />
                    ) : selectedUser.image ? (
                      <CAvatar src={selectedUser.image} size="lg" className={styles.userAvatar} />
                    ) : (
                      <CAvatar size="lg" color="secondary" className={styles.userAvatar}>
                        <CIcon icon={cilUser} />
                      </CAvatar>
                    )}
                  </div>

                  {/* <CAvatar src={selectedUser.image} size="md" color="secondary" className="me-3">
                    {!selectedUser.image && <CIcon icon={cilUser} />}
                  </CAvatar> */}
                  <div>
                    <h6 className={styles.userName}>
                      {' '}
                      {selectedUser.email === 'marketadmin@yopmail.com'
                        ? 'Admin'
                        : selectedUser.name || 'Unknown User'}
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">{selectedUser.email}</small>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  </div>
                </div>
              </CCardHeader>
              <CCardBody className={styles.chatArea}>
                <ChatBox
                  chatId={selectedUser.chatId}
                  currentUserId={userId}
                  receiverId={selectedUser._id}
                />
              </CCardBody>
            </>
          ) : (
            <CCardBody className={styles.chatArea}>
              <div className={styles.emptyMessage}>
                <CIcon icon={cilChatBubble} size="4xl" className="text-muted mb-4" />
                <h4 className="text-muted mb-3">{t('Select a conversation')}</h4>
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
