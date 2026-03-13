import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const EVENT_TYPE_LABELS: Record<string, string> = {
  soiree: 'Soirée',
  sport: 'Sport',
  etude: 'Étude',
  culture: 'Culture',
  autre: 'Autre',
}

export default function EventDetailPage() {
  const { eventId } = useParams()
  const events = useStore((s) => s.events)
  const students = useStore((s) => s.students)
  const currentUser = useStore((s) => s.currentUser)
  const campuses = useStore((s) => s.campuses)
  const participateToEvent = useStore((s) => s.participateToEvent)
  const leaveEvent = useStore((s) => s.leaveEvent)
  const deleteEvent = useStore((s) => s.deleteEvent)
  const isParticipating = useStore((s) => s.isParticipating)
  const [loading, setLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const navigate = useNavigate()

  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div>
        <p>Événement non trouvé.</p>
        <Link to="/">Retour au fil</Link>
      </div>
    )
  }

  const campus = campuses.find((c) => c.id === event.campusId)
  const creator = students.find((s) => s.id === event.creatorId)
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)
  const startStr = start.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const endStr = end.toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
  const canDelete = currentUser?.id === event.creatorId && start > sevenDaysFromNow

  const participating = currentUser ? isParticipating(event.id, currentUser.id) : false

  const handleParticipate = async () => {
    if (currentUser) {
      setLoading(true)
      try {
        await participateToEvent(event.id, currentUser.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleLeave = async () => {
    if (currentUser) {
      setLoading(true)
      try {
        await leaveEvent(event.id, currentUser.id)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelete = async () => {
    if (!currentUser || !canDelete) return
    if (!confirm('Supprimer définitivement cet événement ?')) return
    setLoading(true)
    setDeleteError('')
    try {
      await deleteEvent(event.id, currentUser.id)
      navigate('/')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const typeColor = (event.type === 'soiree' ? 'var(--color-type-soiree)' : event.type === 'sport' ? 'var(--color-type-sport)' : event.type === 'etude' ? 'var(--color-type-etude)' : event.type === 'culture' ? 'var(--color-type-culture)' : 'var(--color-type-autre)')

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Link to="/" style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block', color: 'var(--color-primary)' }}>
        ← Retour au fil
      </Link>

      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt=""
          style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
        />
      )}

      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          background: typeColor,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        {EVENT_TYPE_LABELS[event.type] ?? event.type}
      </span>

      <h1 style={{ margin: '0.75rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{event.title}</h1>

      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        {campus?.name} · {startStr} → {endStr}
      </p>

      <p style={{ margin: '1rem 0', lineHeight: 1.5, color: 'var(--color-text)' }}>{event.description}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        {creator?.avatarUrl ? (
          <img src={creator.avatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
            {creator?.name?.charAt(0) ?? '?'}
          </div>
        )}
        <span>Créé par <Link to={`/profile/${event.creatorId}`}>{creator?.name ?? 'Inconnu'}</Link></span>
      </div>

      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        {event.participantIds.length} participant(s)
      </p>

      <ul style={{ margin: '0.5rem 0 0', paddingLeft: 0, fontSize: '0.875rem', listStyle: 'none' }}>
        {event.participantIds.map((id) => {
          const participant = students.find((s) => s.id === id)
          return (
            <li key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {participant?.avatarUrl ? (
                <img src={participant.avatarUrl} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600 }}>
                  {participant?.name?.charAt(0) ?? '?'}
                </div>
              )}
              <Link to={`/profile/${id}`}>{participant?.name ?? id}</Link>
            </li>
          )
        })}
      </ul>

      {currentUser && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          {participating ? (
            <button
              onClick={handleLeave}
              disabled={loading}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Se désinscrire
            </button>
          ) : (
            <button
              onClick={handleParticipate}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Participer
            </button>
          )}
          {currentUser.id === event.creatorId && (
            <button
              onClick={handleDelete}
              disabled={!canDelete || loading}
              title={!canDelete ? 'Suppression possible uniquement plus de 7 jours avant le début' : ''}
              style={{
                padding: '0.5rem 1rem',
                background: canDelete ? 'var(--color-error)' : 'var(--color-border-muted)',
                color: canDelete ? '#fff' : 'var(--color-text-subtle)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: canDelete ? 'pointer' : 'not-allowed',
                fontWeight: 500,
              }}
            >
              Supprimer l&apos;événement
            </button>
          )}
          {deleteError && <span style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>{deleteError}</span>}
          {currentUser.id === event.creatorId && !canDelete && start <= sevenDaysFromNow && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Suppression possible uniquement plus de 7 jours avant le début
            </span>
          )}
        </div>
      )}
    </div>
  )
}
