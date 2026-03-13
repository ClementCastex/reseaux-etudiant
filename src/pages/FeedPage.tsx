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
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>Fil d'actualité</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
          style={{ padding: '0.5rem 1.25rem' }}
        >
          Créer un événement
        </button>
      </div>

      <div>
        {events.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', padding: '2rem', textAlign: 'center' }}>
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
