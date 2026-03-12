import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Header() {
  const currentUser = useStore((s) => s.currentUser)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const eventSearchQuery = useStore((s) => s.eventSearchQuery)
  const setEventSearchQuery = useStore((s) => s.setEventSearchQuery)
  const navigate = useNavigate()
  const location = useLocation()
  const showSearch = location.pathname === '/' || location.pathname === '/my-events'

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/auth')
  }

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
          Fil d'actualité
        </Link>
        <Link to="/my-events" style={{ fontSize: '0.9rem' }}>Mes événements</Link>
        {showSearch && (
          <input
            type="search"
            value={eventSearchQuery}
            onChange={(e) => setEventSearchQuery(e.target.value)}
            placeholder="Rechercher des événements..."
            style={{
              width: 200,
              padding: '0.35rem 0.6rem',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              fontSize: '0.8rem',
              background: '#f9fafb',
            }}
          />
        )}
      </nav>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        {currentUser && (
          <>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: '#f3f4f6',
                borderRadius: 20,
                fontSize: '0.875rem',
              }}
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                  {currentUser.name.charAt(0)}
                </div>
              )}
              {currentUser.name}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '0.875rem',
                padding: 0,
              }}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  )
}
