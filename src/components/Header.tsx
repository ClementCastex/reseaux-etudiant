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
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-muted)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
          Fil d'actualité
        </Link>
        <Link to="/my-events" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
          Mes événements
        </Link>
        {showSearch && (
          <input
            type="search"
            value={eventSearchQuery}
            onChange={(e) => setEventSearchQuery(e.target.value)}
            placeholder="Rechercher des événements..."
            style={{
              width: 200,
              padding: '0.35rem 0.6rem',
              border: '1px solid var(--color-border-muted)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              background: 'var(--color-bg)',
            }}
          />
        )}
      </nav>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/messages" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          Messages
        </Link>
        <Link to="/notifications" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          Notifications
        </Link>
        {currentUser && (
          <>
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                color: 'var(--color-primary-hover)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
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
                color: 'var(--color-text-subtle)',
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
