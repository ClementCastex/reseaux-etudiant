import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '1rem 2rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}
