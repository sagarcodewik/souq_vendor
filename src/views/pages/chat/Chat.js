import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrGetChat } from '../../../redux/slice/chat'
import { fetchVendorProfile } from '../../../redux/slice/profile'
import ChatBox from '../../../components/Chat'
import Loader from '../../../components/loader/loader'

const ChatPage = () => {
  const dispatch = useDispatch()
  const [chatId, setChatId] = useState('')
  const [chatRequested, setChatRequested] = useState(false)

  const userTwoId = 'admin'
  const orderId = null
  const chatType = 'general'

  const { profile } = useSelector((state) => state.vendorProfile || {})
  const { vendor, status: profileStatus = 'idle', error: profileError } = profile || {}

  const currentUserId = vendor?.userId?._id
  const receiverId = userTwoId
  const { fetchStatus } = useSelector((state) => state.chat)

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchVendorProfile())
    }
  }, [dispatch, profileStatus])

  useEffect(() => {
    if (!currentUserId || chatRequested) return

    setChatRequested(true)
    dispatch(createOrGetChat({ userOneId: currentUserId, userTwoId, orderId, chatType }))
      .unwrap()
      .then((chat) => setChatId(chat._id))
      .catch((err) => {
        console.error('Error fetching/creating chat:', err)
        setChatRequested(false)
      })
  }, [dispatch, currentUserId, userTwoId, orderId, chatType, chatRequested])

  return (
    <div className="chat-page">
      <h2 className="chat-page__title">Customer Support</h2>
      {chatId && currentUserId && receiverId && fetchStatus !== 'loading' ? (
        <ChatBox chatId={chatId} currentUserId={currentUserId} receiverId={receiverId} />
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default ChatPage
