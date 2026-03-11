import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import EditProfileModal from '../components/EditProfileModal'

const EVENT_TYPE_LABELS: Record<string, string> = {
  soiree: 'Soirée',
  sport: 'Sport',
  etude: 'Étude',
  culture: 'Culture',
  autre: 'Autre',
}

export default function ProfilePage() {
  const { studentId } = useParams()
  const currentUser = useStore((s) => s.currentUser)
  const students = useStore((s) => s.students)

  const campuses = useStore((s) => s.campuses)
  const studentIdToShow = studentId || currentUser?.id
  const student = students.find((s) => s.id === studentIdToShow)
  const campus = student ? campuses.find((c) => c.id === student.campusId) : null
  const isOwnProfile = currentUser?.id === studentIdToShow

  const [showEditModal, setShowEditModal] = useState(false)

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
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
        {isOwnProfile && (
          <button
            onClick={() => setShowEditModal(true)}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.875rem',
              background: '#4338ca',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Modifier le profil
          </button>
        )}
      </div>

      {/* Photo de profil */}
      <div style={{ marginBottom: '1.25rem' }}>
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.name}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #e5e7eb',
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem' }}>{student.name}</h1>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{student.email}</p>

      <div style={{ marginTop: '1.25rem', fontSize: '0.9rem' }}>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Campus :</strong> {campus?.name ?? '—'}
        </p>
        {student.formation && (
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Formation :</strong> {student.formation}
          </p>
        )}
        {student.phone && (
          <p style={{ margin: '0.5rem 0' }}>
            <strong>Téléphone :</strong> {student.phone}
          </p>
        )}
      </div>

      {student.bio && (
        <p
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: 6,
            fontSize: '0.9rem',
            lineHeight: 1.5,
            borderLeft: '3px solid #e0e7ff',
          }}
        >
          {student.bio}
        </p>
      )}

      {student.interests && student.interests.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Centres d'intérêt
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {student.interests.map((i) => (
              <span
                key={i}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.8rem',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  borderRadius: 20,
                }}
              >
                {EVENT_TYPE_LABELS[i] ?? i}
              </span>
            ))}
          </div>
        </div>
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

      {showEditModal && (
        <EditProfileModal student={student} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  )
}
