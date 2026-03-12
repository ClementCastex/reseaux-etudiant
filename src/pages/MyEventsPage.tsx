import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import EventCard from '../components/EventCard'
import type { EventType } from '../types'

const EVENT_TYPES: { value: EventType | ''; label: string }[] = [
  { value: '', label: 'Tous les types' },
  { value: 'soiree', label: 'Soirée' },
  { value: 'sport', label: 'Sport' },
  { value: 'etude', label: 'Étude' },
  { value: 'culture', label: 'Culture' },
  { value: 'autre', label: 'Autre' },
]

export default function MyEventsPage() {
  const currentUser = useStore((s) => s.currentUser)
  const events = useStore((s) => s.events)
  const campuses = useStore((s) => s.campuses)

  const [search, setSearch] = useState('')
  const [campusId, setCampusId] = useState('')
  const [type, setType] = useState<EventType | ''>('')

  const myEvents = useMemo(() => {
    return events.filter((e) => e.creatorId === currentUser?.id)
  }, [events, currentUser?.id])

  const filteredEvents = useMemo(() => {
    return myEvents.filter((event) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchTitle = event.title.toLowerCase().includes(q)
        const matchDesc = event.description?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc) return false
      }
      if (campusId && event.campusId !== campusId) return false
      if (type && event.type !== type) return false
      return true
    })
  }, [myEvents, search, campusId, type])

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Mes événements</h1>

      {myEvents.length > 0 && (
        <div
          style={{
            background: '#f9fafb',
            padding: '1rem 1.25rem',
            borderRadius: 8,
            marginBottom: '1.5rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: '#374151' }}>Filtres</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px', minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>Rechercher</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Titre ou description..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                }}
              />
            </div>
            <div style={{ minWidth: 140 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>Campus</label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Tous</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: 130 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType | '')}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                }}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
            {filteredEvents.length} événement(s)
          </p>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <p style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>
          Vous n&apos;avez créé aucun événement.{" "}
          <Link to="/" style={{ color: '#2563eb' }}>
            Créer un événement
          </Link>
        </p>
      ) : (
        <div>
          {myEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
