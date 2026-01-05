import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMessagesByChatId, addSocketMessage } from '../redux/slice/chat'
import io from 'socket.io-client'
import styles from './chat.module.scss'
import { localDateFormat } from '../utils'
import { socket } from '../socket'

const ChatBox = ({ chatId, currentUserId, receiverId }) => {
  const dispatch = useDispatch()
  const messages = useSelector((state) => state.chat.messages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!chatId) return
    dispatch(fetchMessagesByChatId(chatId))
  }, [chatId, dispatch])

  useEffect(() => {
    if (!chatId) return

    // socket.connect()
    socket.emit('joinRoom', { chatId })

    socket.on('newMessage', (msg) => {
      dispatch(addSocketMessage(msg))
    })

    return () => {
      socket.off('newMessage')
      socket.emit('leaveRoom', { chatId })
      socket.disconnect()
    }
  }, [chatId, dispatch])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    socket.emit('sendMessage', {
      chatId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    })
    setNewMessage('')
  }

  return (
    <div className={styles.chat_box}>
      <div className={styles.chat_box__messages}>
        {messages.length === 0 ? (
          <p className={styles.chat_box__empty}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUserId
            return (
              <div
                key={msg._id || idx}
                className={`${styles.chat_box__message} ${isOwn ? styles.own : styles.other}`}
              >
                <div className={styles.chat_box__bubble}>{msg.message}</div>
                <span className={styles.chat_box__timestamp}>{localDateFormat(msg.timestamp)}</span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chat_box__input}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatBox
