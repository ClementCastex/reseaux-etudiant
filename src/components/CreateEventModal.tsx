import { useState, useRef } from 'react'
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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [campusId, setCampusId] = useState(currentUser?.campusId ?? campuses[0]?.id ?? '')
  const [type, setType] = useState<EventType>('soiree')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !title.trim() || !startDate || !endDate) return
    if (new Date(endDate) <= new Date(startDate)) {
      setError('L\'heure de fin doit être après l\'heure de début')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await addEvent({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl ?? undefined,
        startDate,
        endDate,
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
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          maxWidth: 480,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border-muted)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)', fontWeight: 700 }}>Créer un événement</h2>

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
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
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
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Image de l&apos;événement
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Aperçu" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem' }}>
                    Changer
                  </button>
                  <button type="button" onClick={() => setImageUrl(null)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem', background: 'var(--color-accent-light)', color: 'var(--color-error)' }}>
                    Supprimer
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                  Ajouter une image
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Début
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Fin
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
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
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
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
                border: '1px solid var(--color-border-muted)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
            className="btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            {submitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
