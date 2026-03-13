import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import EditProfileModal from '../components/EditProfileModal'
import FormationBadge from '../components/FormationBadge'

const EVENT_TYPE_LABELS: Record<string, string> = {
  soiree: 'Soirée',
  sport: 'Sport',
  etude: 'Étude',
  culture: 'Culture',
  autre: 'Autre',
}

export default function ProfilePage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const currentUser = useStore((s) => s.currentUser)
  const setCurrentUser = useStore((s) => s.setCurrentUser)
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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        maxWidth: 480,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary-hover)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {campus?.name ?? 'Campus'}
          </span>
          {student.formation && <FormationBadge formation={student.formation} />}
        </div>
        {isOwnProfile && (
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-primary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.875rem' }}
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
              border: '3px solid var(--color-border-muted)',
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'var(--color-primary)',
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

      <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{student.name}</h1>
      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{student.email}</p>

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
            background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            borderLeft: '3px solid var(--color-primary)',
            color: 'var(--color-text)',
          }}
        >
          {student.bio}
        </p>
      )}

      {student.interests && student.interests.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Centres d'intérêt
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {student.interests.map((i) => (
              <span
                key={i}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.8rem',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary-hover)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {EVENT_TYPE_LABELS[i] ?? i}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isOwnProfile && currentUser && (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <Link
            to={`/messages?new=${student.id}`}
            className="btn-primary"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            Envoyer un message
          </Link>
        </div>
      )}

      {isOwnProfile && (
        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => {
              setCurrentUser(null)
              navigate('/auth')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-subtle)',
              fontSize: '0.875rem',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Déconnexion
          </button>
        </div>
      )}

      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-primary)',
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
