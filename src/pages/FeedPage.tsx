import { useState } from 'react'
import { useStore } from '../store/useStore'
import EventCard from '../components/EventCard'
import CreateEventModal from '../components/CreateEventModal'

export default function FeedPage() {
  const events = useStore((s) => s.events)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Fil d'actualité</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 500,
          }}
        >
          Créer un événement
        </button>
      </div>

      <div>
        {events.length === 0 ? (
          <p style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>
            Aucun événement pour le moment. Créez le premier !
          </p>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>

      {showCreateModal && <CreateEventModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
