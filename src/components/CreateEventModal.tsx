import { useState } from 'react'
import type { EventType } from '../types'
import { useStore } from '../store/useStore'

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'soiree', label: 'Soirée' },
  { value: 'sport', label: 'Sport' },
  { value: 'etude', label: 'Étude' },
  { value: 'culture', label: 'Culture' },
  { value: 'autre', label: 'Autre' },
]

interface CreateEventModalProps {
  onClose: () => void
}

export default function CreateEventModal({ onClose }: CreateEventModalProps) {
  const currentUser = useStore((s) => s.currentUser)
  const campuses = useStore((s) => s.campuses)
  const addEvent = useStore((s) => s.addEvent)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [campusId, setCampusId] = useState(currentUser?.campusId ?? campuses[0]?.id ?? '')
  const [type, setType] = useState<EventType>('soiree')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !title.trim() || !date) return
    setSubmitting(true)
    setError('')
    try {
      await addEvent({
        title: title.trim(),
        description: description.trim(),
        date,
        campusId,
        type,
        creatorId: currentUser.id,
        participantIds: [currentUser.id],
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: 8,
          maxWidth: 480,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem' }}>Créer un événement</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Date et heure
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Campus
            </label>
            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Type d'événement
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
              }}
            >
              {submitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
