import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { mockCampuses, mockStudents } from '../data/mockData'

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
  const currentUser = useStore((s) => s.currentUser)
  const participateToEvent = useStore((s) => s.participateToEvent)
  const leaveEvent = useStore((s) => s.leaveEvent)
  const isParticipating = useStore((s) => s.isParticipating)

  const event = events.find((e) => e.id === eventId)

  if (!event) {
    return (
      <div>
        <p>Événement non trouvé.</p>
        <Link to="/">Retour au fil</Link>
      </div>
    )
  }

  const campus = mockCampuses.find((c) => c.id === event.campusId)
  const creator = mockStudents.find((s) => s.id === event.creatorId)
  const date = new Date(event.date)
  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const participating = currentUser ? isParticipating(event.id, currentUser.id) : false

  const handleParticipate = () => {
    if (currentUser) {
      participateToEvent(event.id, currentUser.id)
    }
  }

  const handleLeave = () => {
    if (currentUser) {
      leaveEvent(event.id, currentUser.id)
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '2rem',
      }}
    >
      <Link to="/" style={{ fontSize: '0.875rem', marginBottom: '1rem', display: 'inline-block' }}>
        ← Retour au fil
      </Link>

      <span
        style={{
          fontSize: '0.75rem',
          background: '#e0e7ff',
          color: '#4338ca',
          padding: '4px 10px',
          borderRadius: 4,
        }}
      >
        {EVENT_TYPE_LABELS[event.type] ?? event.type}
      </span>

      <h1 style={{ margin: '0.75rem 0', fontSize: '1.5rem' }}>{event.title}</h1>

      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
        {campus?.name} · {dateStr}
      </p>

      <p style={{ margin: '1rem 0', lineHeight: 1.5 }}>{event.description}</p>

      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
        Créé par{' '}
        <Link to={`/profile/${event.creatorId}`}>
          {creator?.name ?? 'Inconnu'}
        </Link>
      </p>

      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {event.participantIds.length} participant(s)
      </p>

      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
        {event.participantIds.map((id) => {
          const participant = mockStudents.find((s) => s.id === id)
          return (
            <li key={id}>
              <Link to={`/profile/${id}`}>{participant?.name ?? id}</Link>
            </li>
          )
        })}
      </ul>

      {currentUser && (
        <div style={{ marginTop: '1.5rem' }}>
          {participating ? (
            <button
              onClick={handleLeave}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              Se désinscrire
            </button>
          ) : (
            <button
              onClick={handleParticipate}
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
              }}
            >
              Participer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
