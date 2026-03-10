import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Header() {
  const currentUser = useStore((s) => s.currentUser)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const navigate = useNavigate()

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/auth')
  }

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, color: '#333' }}>
          Fil d'actualité
        </Link>
        <Link to="/profile">Mon profil</Link>
      </nav>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        {currentUser && (
          <>
            <Link
              to="/profile"
              style={{
                padding: '0.25rem 0.5rem',
                background: '#f3f4f6',
                borderRadius: 4,
                fontSize: '0.875rem',
              }}
            >
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
