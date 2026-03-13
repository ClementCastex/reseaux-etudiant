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

function CreateGroupModal({
  onClose,
  onCreate,
  currentUserId,
  students,
  friendIds,
}: {
  onClose: () => void
  onCreate: (conv: Conversation) => void
  currentUserId: string
  students: { id: string; name: string }[]
  friendIds: string[]
}) {
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const candidates = students
    .filter((s) => s.id !== currentUserId)
    .sort((a, b) => {
      const aFriend = friendIds.includes(a.id)
      const bFriend = friendIds.includes(b.id)
      if (aFriend && !bFriend) return -1
      if (!aFriend && bFriend) return 1
      return a.name.localeCompare(b.name)
    })

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Indiquez un nom pour le groupe.')
      return
    }
    if (selectedIds.size < 1) {
      setError('Sélectionnez au moins un participant.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const participantIds = [currentUserId, ...selectedIds]
      const conv = await api.conversations.create(participantIds, true, trimmed)
      onCreate(conv)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          maxWidth: 420,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border-muted)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: 'var(--color-text)' }}>Créer un groupe</h3>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
          Nom du groupe
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Groupe projet X"
          className="input-base"
          style={{ width: '100%', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
          Participants
        </label>
        <div
          style={{
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid var(--color-border-muted)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {candidates.map((s) => (
            <label
              key={s.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggle(s.id)} />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>{s.name}</span>
              {friendIds.includes(s.id) && (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>• ami</span>
              )}
            </label>
          ))}
        </div>
        {error && (
          <p style={{ margin: '0 0 0.75rem', color: 'var(--color-error)', fontSize: '0.875rem' }}>{error}</p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || selectedIds.size < 1 || !name.trim()}
            className="btn-primary"
          >
            {loading ? 'Création...' : 'Créer le groupe'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const [searchParams] = useSearchParams()
  const newWithStudentId = searchParams.get('new')
  const currentUser = useStore((s) => s.currentUser)
  const students = useStore((s) => s.students)
  const friendIds = useStore((s) => s.friendIds)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [creatingNew, setCreatingNew] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
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
          const existing = list.find(
            (c) => !c.isGroup && c.participants.some((p) => p.id === newWithStudentId)
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
          const conv = await api.conversations.create([currentUser.id, newWithStudentId], false)
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
  const otherParticipant =
    selectedConv && !selectedConv.isGroup
      ? selectedConv.participants.find((p) => p.id !== currentUser?.id)
      : null

  const handleCreateGroup = (conv: Conversation) => {
    setConversations((prev) => [...prev, conv])
    setSelectedId(conv.id)
  }

  const handleSend = async () => {
    if (!currentUser || !selectedId || !newMessage.trim()) return
    setSending(true)
    try {
      const msg = await api.conversations.sendMessage(selectedId, currentUser.id, newMessage.trim())
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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 280,
          borderRight: '1px solid var(--color-border-muted)',
          overflowY: 'auto',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border-muted)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text)' }}>Messages</h2>
            <button
              type="button"
              onClick={() => setShowCreateGroup(true)}
              className="btn-primary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            >
              Créer un groupe
            </button>
          </div>
        </div>
        {loading ? (
          <p style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Chargement...
          </p>
        ) : conversations.length === 0 && !creatingNew ? (
          <p style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Aucune conversation. Utilisez &quot;Créer un groupe&quot; ou cliquez sur
            &quot;Envoyer un message&quot; sur un profil.
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
                  background: isSelected ? 'var(--color-primary-light)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: conv.isGroup
                      ? 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)'
                      : 'var(--color-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {conv.isGroup ? '👥' : label.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    {label}
                  </p>
                  {conv.lastMessage && (
                    <p
                      style={{
                        margin: '0.2rem 0 0',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
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
          <p style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Création de la conversation...
          </p>
        )}
      </div>

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
                borderBottom: '1px solid var(--color-border-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                {getConversationLabel(selectedConv, currentUser.id)}
              </span>
              {selectedConv.isGroup && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(groupe)</span>
              )}
              {otherParticipant && (
                <Link
                  to={`/profile/${otherParticipant.id}`}
                  style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}
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
                      background: isMe ? 'var(--color-primary)' : 'var(--color-border-muted)',
                      color: isMe ? '#fff' : 'var(--color-text)',
                      borderRadius: 'var(--radius-md)',
                      borderRadiusBottomRight: isMe ? 4 : 'var(--radius-md)',
                      borderRadiusBottomLeft: isMe ? 'var(--radius-md)' : 4,
                    }}
                  >
                    {!isMe && (
                      <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', opacity: 0.9 }}>{msg.senderName}</p>
                    )}
                    <p style={{ margin: 0, fontSize: '0.9rem', wordBreak: 'break-word' }}>{msg.text}</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.7rem', opacity: 0.8 }}>
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
                borderTop: '1px solid var(--color-border-muted)',
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
                className="input-base"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="btn-primary"
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
              color: 'var(--color-text-subtle)',
              fontSize: '0.9rem',
            }}
          >
            {creatingNew
              ? 'Ouverture de la conversation...'
              : 'Sélectionnez une conversation, créez un groupe ou envoyez un message depuis un profil.'}
          </div>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
          currentUserId={currentUser.id}
          students={students}
          friendIds={friendIds}
        />
      )}
    </div>
  )
}
