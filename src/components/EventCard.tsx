import { Link } from 'react-router-dom'
import type { Event } from '../types'
import { mockCampuses } from '../data/mockData'

const EVENT_TYPE_LABELS: Record<string, string> = {
  soiree: 'Soirée',
  sport: 'Sport',
  etude: 'Étude',
  culture: 'Culture',
  autre: 'Autre',
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const campus = mockCampuses.find((c) => c.id === event.campusId)
  const date = new Date(event.date)
  const dateStr = date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              background: '#e0e7ff',
              color: '#4338ca',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {EVENT_TYPE_LABELS[event.type] ?? event.type}
          </span>
          <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{event.title}</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            {campus?.name} · {dateStr}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{event.description}</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
            {event.participantIds.length} participant(s)
          </p>
        </div>
        <Link
          to={`/event/${event.id}`}
          style={{
            padding: '0.5rem 1rem',
            background: '#2563eb',
            color: '#fff',
            borderRadius: 4,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
          }}
        >
          Voir le détail
        </Link>
      </div>
    </div>
  )
}
