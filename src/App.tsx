import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import EventDetailPage from './pages/EventDetailPage'
import MyEventsPage from './pages/MyEventsPage'
import MessagesPlaceholder from './pages/MessagesPlaceholder'
import NotificationsPlaceholder from './pages/NotificationsPlaceholder'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((s) => s.currentUser)
  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((s) => s.currentUser)
  if (currentUser) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

export default function App() {
  const loadFromApi = useStore((s) => s.loadFromApi)
  const isLoading = useStore((s) => s.isLoading)
  const error = useStore((s) => s.error)

  useEffect(() => {
    loadFromApi()
  }, [loadFromApi])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <p>Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '2rem' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>Lancez l&apos;API avec : <code>npm run dev:api</code></p>
        <button onClick={() => loadFromApi()} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Réessayer</button>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FeedPage />} />
        <Route path="my-events" element={<MyEventsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:studentId" element={<ProfilePage />} />
        <Route path="event/:eventId" element={<EventDetailPage />} />
        <Route path="messages" element={<MessagesPlaceholder />} />
        <Route path="notifications" element={<NotificationsPlaceholder />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
