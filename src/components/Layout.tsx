import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { useStore } from '../store/useStore'

export default function Layout() {
  const currentUser = useStore((s) => s.currentUser)
  const loadFriendships = useStore((s) => s.loadFriendships)

  useEffect(() => {
    if (currentUser?.id) loadFriendships()
  }, [currentUser?.id, loadFriendships])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Header />
      <main style={{ flex: 1, padding: '1.5rem 2rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}
