import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { mockStudents, mockCampuses } from '../data/mockData'

export default function ProfilePage() {
  const { studentId } = useParams()
  const currentUser = useStore((s) => s.currentUser)

  const studentIdToShow = studentId || currentUser?.id
  const student = mockStudents.find((s) => s.id === studentIdToShow)
  const campus = student ? mockCampuses.find((c) => c.id === student.campusId) : null
  const isOwnProfile = currentUser?.id === studentIdToShow

  if (!student) {
    return (
      <div>
        <p>Profil non trouvé.</p>
        <Link to="/">Retour au fil</Link>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '2rem',
        maxWidth: 480,
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '4px 10px',
            borderRadius: 4,
          }}
        >
          {campus?.name ?? 'Campus'}
        </span>
      </div>

      <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>{student.name}</h1>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{student.email}</p>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Campus : <strong>{campus?.name ?? '—'}</strong>
      </p>

      {isOwnProfile && (
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
          C'est votre profil. Les fonctionnalités d'édition seront ajoutées plus tard.
        </p>
      )}

      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          fontSize: '0.875rem',
        }}
      >
        ← Retour au fil
      </Link>
    </div>
  )
}
