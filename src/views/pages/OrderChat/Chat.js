import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrGetChat } from '../../../redux/slice/chat'
import ChatBox from '../../../components/Chat'
import Loader from '../../../components/loader/loader'
import { useLocation } from 'react-router-dom'

const ChatPage = () => {
  const location = useLocation()
  const {
    userOneId,
    userTwoId,
    orderId,
    chatType = 'order',
    orderNumber,
    type,
  } = location.state || {}
  const dispatch = useDispatch()
  const [chatId, setChatId] = useState('')
  const [chatRequested, setChatRequested] = useState(false)

  const currentUserId = userOneId // ✅ vendor fallback removed
  const receiverId = userTwoId
  const { fetchStatus } = useSelector((state) => state.chat)

  useEffect(() => {
    console.log('userOneId:', userOneId, 'userTwoId:', userTwoId, 'orderId:', orderId)
  }, [userOneId, userTwoId, orderId])

  useEffect(() => {
    if (!currentUserId || !receiverId || chatRequested) return

    setChatRequested(true)
    dispatch(
      createOrGetChat({ userOneId: currentUserId, userTwoId: receiverId, orderId, chatType }),
    )
      .unwrap()
      .then((chat) => setChatId(chat._id))
      .catch((err) => {
        console.error('Error fetching/creating chat:', err)
        setChatRequested(false)
      })
  }, [dispatch, currentUserId, receiverId, orderId, chatType, chatRequested])

  return (
    <div className="chat-page">
      <h3 className="chat-page__title">{`Order Chat - ${orderNumber}(${type})`}</h3>
      {chatId && currentUserId && receiverId && fetchStatus !== 'loading' ? (
        <ChatBox chatId={chatId} currentUserId={currentUserId} receiverId={receiverId} />
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default ChatPage
