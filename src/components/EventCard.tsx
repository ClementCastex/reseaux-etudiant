import { Link } from 'react-router-dom'
import type { Event } from '../types'
import { useStore } from '../store/useStore'
import FormationBadge from './FormationBadge'

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
  const campuses = useStore((s) => s.campuses)
  const students = useStore((s) => s.students)
  const friendIds = useStore((s) => s.friendIds)
  const campus = campuses.find((c) => c.id === event.campusId)
  const creator = students.find((s) => s.id === event.creatorId)
  const hasFriendParticipating = friendIds.some((fid) => event.participantIds.includes(fid))
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)
  const startStr = start.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  const endStr = end.toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: '1rem',
      }}
    >
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt=""
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.25rem' }}>
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
            {creator?.formation && <FormationBadge formation={creator.formation} size="sm" />}
            {hasFriendParticipating && (
              <span
                style={{
                  fontSize: '0.7rem',
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                Un ami participe
              </span>
            )}
          </div>
          <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{event.title}</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
            {campus?.name} · {startStr} → {endStr}
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
    </div>
  )
}
