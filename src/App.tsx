import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import EventDetailPage from './pages/EventDetailPage'
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
