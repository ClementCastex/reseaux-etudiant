import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { api } from '../api/client'
import type { Conversation, Message } from '../types'

function formatDate(d: string) {
  const date = new Date(d)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function getConversationLabel(conv: Conversation, currentUserId: string) {
  if (conv.name) return conv.name
  const other = conv.participants.find((p) => p.id !== currentUserId)
  return other?.name ?? 'Conversation'
}

export default function MessagesPage() {
  const [searchParams] = useSearchParams()
  const newWithStudentId = searchParams.get('new')
  const currentUser = useStore((s) => s.currentUser)
  const students = useStore((s) => s.students)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [creatingNew, setCreatingNew] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!currentUser) return
    const load = async () => {
      setLoading(true)
      try {
        const list = await api.conversations.list(currentUser.id)
        setConversations(list)
        if (newWithStudentId) {
          const existing = list.find((c) =>
            c.participants.some((p) => p.id === newWithStudentId)
          )
          if (existing) {
            setSelectedId(existing.id)
          } else {
            setCreatingNew(true)
          }
        } else if (list.length > 0 && !selectedId) {
          setSelectedId(list[0].id)
        }
      } catch {
        setConversations([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser?.id, newWithStudentId])

  useEffect(() => {
    if (creatingNew && newWithStudentId && currentUser) {
      const createAndOpen = async () => {
        try {
          const conv = await api.conversations.create(
            [currentUser.id, newWithStudentId],
            false
          )
          setConversations((prev) => [...prev, conv])
          setSelectedId(conv.id)
          window.history.replaceState({}, '', '/messages')
        } catch {
          setCreatingNew(false)
        } finally {
          setCreatingNew(false)
        }
      }
      createAndOpen()
    }
  }, [creatingNew, newWithStudentId, currentUser?.id])

  useEffect(() => {
    if (!selectedId || !currentUser) return
    const load = async () => {
      try {
        const msgs = await api.conversations.getMessages(selectedId, currentUser.id)
        setMessages(msgs)
      } catch {
        setMessages([])
      }
    }
    load()
  }, [selectedId, currentUser?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const selectedConv = conversations.find((c) => c.id === selectedId)
  const otherParticipant = selectedConv?.participants.find((p) => p.id !== currentUser?.id)

  const handleSend = async () => {
    if (!currentUser || !selectedId || !newMessage.trim()) return
    setSending(true)
    try {
      const msg = await api.conversations.sendMessage(
        selectedId,
        currentUser.id,
        newMessage.trim()
      )
      setMessages((prev) => [...prev, msg])
      setNewMessage('')
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                lastMessage: {
                  text: msg.text,
                  createdAt: msg.createdAt,
                  senderName: msg.senderName,
                },
              }
            : c
        )
      )
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  if (!currentUser) return null

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 180px)',
        minHeight: 400,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Liste des conversations */}
      <div
        style={{
          width: 280,
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Messages</h2>
        </div>
        {loading ? (
          <p style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Chargement...
          </p>
        ) : conversations.length === 0 && !creatingNew ? (
          <p style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Aucune conversation. Allez sur un profil et cliquez sur &quot;Envoyer un message&quot;.
          </p>
        ) : (
          conversations.map((conv) => {
            const label = getConversationLabel(conv, currentUser.id)
            const isSelected = conv.id === selectedId
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedId(conv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {label.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>{label}</p>
                  {conv.lastMessage && (
                    <p
                      style={{
                        margin: '0.2rem 0 0',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conv.lastMessage.senderName}: {conv.lastMessage.text}
                    </p>
                  )}
                </div>
              </button>
            )
          })
        )}
        {creatingNew && (
          <p style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Création de la conversation...
          </p>
        )}
      </div>

      {/* Zone de chat */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {selectedConv ? (
          <>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {getConversationLabel(selectedConv, currentUser.id)}
              </span>
              {otherParticipant && (
                <Link
                  to={`/profile/${otherParticipant.id}`}
                  style={{ fontSize: '0.8rem', color: '#2563eb' }}
                >
                  Voir le profil
                </Link>
              )}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      padding: '0.5rem 0.75rem',
                      background: isMe ? '#2563eb' : '#f3f4f6',
                      color: isMe ? '#fff' : '#111',
                      borderRadius: 12,
                      borderRadiusBottomRight: isMe ? 4 : 12,
                      borderRadiusBottomLeft: isMe ? 12 : 4,
                    }}
                  >
                    {!isMe && (
                      <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', opacity: 0.9 }}>
                        {msg.senderName}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: '0.9rem', wordBreak: 'break-word' }}>
                      {msg.text}
                    </p>
                    <p
                      style={{
                        margin: '0.2rem 0 0',
                        fontSize: '0.7rem',
                        opacity: 0.8,
                      }}
                    >
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '0.5rem',
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: sending ? 'wait' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {sending ? '...' : 'Envoyer'}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '0.9rem',
            }}
          >
            {creatingNew
              ? 'Ouverture de la conversation...'
              : 'Sélectionnez une conversation ou envoyez un message depuis un profil.'}
          </div>
        )}
      </div>
    </div>
  )
}
