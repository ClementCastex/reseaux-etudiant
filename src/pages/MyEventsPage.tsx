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
  const eventSearchQuery = useStore((s) => s.eventSearchQuery)
  const setEventSearchQuery = useStore((s) => s.setEventSearchQuery)

  const [campusId, setCampusId] = useState('')
  const [type, setType] = useState<EventType | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const myEvents = useMemo(() => {
    return events.filter((e) => e.creatorId === currentUser?.id)
  }, [events, currentUser?.id])

  const filteredEvents = useMemo(() => {
    return myEvents.filter((event) => {
      if (eventSearchQuery.trim()) {
        const q = eventSearchQuery.toLowerCase().trim()
        const matchTitle = event.title.toLowerCase().includes(q)
        const matchDesc = event.description?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc) return false
      }
      if (campusId && event.campusId !== campusId) return false
      if (type && event.type !== type) return false
      const start = new Date(event.startDate)
      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setHours(0, 0, 0, 0)
        if (start < from) return false
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (start > to) return false
      }
      return true
    })
  }, [myEvents, eventSearchQuery, campusId, type, dateFrom, dateTo])

  const hasFilters = eventSearchQuery || campusId || type || dateFrom || dateTo

  return (
    <div>
      <h1 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Mes événements</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem' }}>
        <select
          value={campusId}
          onChange={(e) => setCampusId(e.target.value)}
          title="Campus"
          style={{
            padding: '0.35rem 0.6rem',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: '0.8rem',
            background: '#fff',
          }}
        >
          <option value="">Tous les campus</option>
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType | '')}
          title="Type"
          style={{
            padding: '0.35rem 0.6rem',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: '0.8rem',
            background: '#fff',
          }}
        >
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="Date début"
          style={{
            padding: '0.35rem 0.6rem',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: '0.8rem',
          }}
        />
        <span style={{ color: '#9ca3af' }}>→</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="Date fin"
          style={{
            padding: '0.35rem 0.6rem',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: '0.8rem',
          }}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setEventSearchQuery('')
              setCampusId('')
              setType('')
              setDateFrom('')
              setDateTo('')
            }}
            style={{
              padding: '0.35rem 0.6rem',
              background: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              fontSize: '0.8rem',
            }}
          >
            Réinitialiser
          </button>
        )}
        <span style={{ marginLeft: 'auto', color: '#9ca3af' }}>{filteredEvents.length} événement(s)</span>
      </div>

      {filteredEvents.length === 0 ? (
        <p style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>
          {myEvents.length === 0
            ? "Vous n'avez créé aucun événement. "
            : "Aucun événement ne correspond à vos critères. "}
          <Link to="/" style={{ color: '#2563eb' }}>
            Créer un événement
          </Link>
        </p>
      ) : (
        <div>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
