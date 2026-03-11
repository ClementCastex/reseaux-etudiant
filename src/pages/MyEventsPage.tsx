import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import EventCard from '../components/EventCard'

export default function MyEventsPage() {
  const currentUser = useStore((s) => s.currentUser)
  const events = useStore((s) => s.events)

  const myEvents = events.filter((e) => e.creatorId === currentUser?.id)

  return (
    <div>
      <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Mes événements</h1>

      {myEvents.length === 0 ? (
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
