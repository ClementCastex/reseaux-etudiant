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

  const typeColor = (event.type === 'soiree' ? 'var(--color-type-soiree)' : event.type === 'sport' ? 'var(--color-type-sport)' : event.type === 'etude' ? 'var(--color-type-etude)' : event.type === 'culture' ? 'var(--color-type-culture)' : 'var(--color-type-autre)')

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '1rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {event.imageUrl && (
        <div style={{ height: 160, overflow: 'hidden' }}>
          <img
            src={event.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.25rem' }}>
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
              {creator?.formation && <FormationBadge formation={creator.formation} size="sm" />}
              {hasFriendParticipating && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-success)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  Un ami participe
                </span>
              )}
            </div>
            <h3 style={{ margin: '0.6rem 0 0.25rem', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {event.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {campus?.name} · {startStr} → {endStr}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
              {event.description}
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              {event.participantIds.length} participant(s)
            </p>
          </div>
          <Link
            to={`/event/${event.id}`}
            style={{
              padding: '0.5rem 1.25rem',
              background: 'var(--color-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            Voir le détail
          </Link>
        </div>
      </div>
    </div>
  )
}
