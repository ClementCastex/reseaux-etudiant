import { useState, useRef } from 'react'
import type { Student, EventType } from '../types'
import { useStore } from '../store/useStore'

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'soiree', label: 'Soirée' },
  { value: 'sport', label: 'Sport' },
  { value: 'etude', label: 'Étude' },
  { value: 'culture', label: 'Culture' },
  { value: 'autre', label: 'Autre' },
]

interface EditProfileModalProps {
  student: Student
  onClose: () => void
}

export default function EditProfileModal({ student, onClose }: EditProfileModalProps) {
  const updateStudent = useStore((s) => s.updateStudent)
  const campuses = useStore((s) => s.campuses)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(student.name)
  const [email, setEmail] = useState(student.email)
  const [campusId, setCampusId] = useState(student.campusId)
  const [bio, setBio] = useState(student.bio ?? '')
  const [phone, setPhone] = useState(student.phone ?? '')
  const [formation, setFormation] = useState(student.formation ?? '')
  const [interests, setInterests] = useState<string[]>(student.interests ?? [])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(student.avatarUrl ?? null)

  const toggleInterest = (value: EventType) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudent(student.id, {
      name: name.trim(),
      email: email.trim(),
      campusId,
      bio: bio.trim() || null,
      phone: phone.trim() || null,
      formation: formation.trim() || null,
      interests: interests.length ? interests : null,
      avatarUrl: avatarUrl || null,
    })
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          maxWidth: 480,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border-muted)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)', fontWeight: 700 }}>Modifier le profil</h2>

        <form onSubmit={handleSubmit}>
          {/* Photo de profil */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem' }}>
              Photo de profil
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--color-primary-light)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--color-primary)',
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem', color: '#6b7280' }}>+</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.875rem',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  {avatarUrl ? 'Changer' : 'Ajouter'}
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    style={{
                      marginLeft: 8,
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.875rem',
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Adresse mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Campus
            </label>
            <select
              value={campusId}
              onChange={(e) => setCampusId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Formation / filière
            </label>
            <input
              type="text"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              placeholder="ex: Licence Info, Master MEEF"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Bio / description
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présentez-vous en quelques mots..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem' }}>
              Centres d'intérêt (événements préférés)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleInterest(t.value)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    border: `1px solid ${interests.includes(t.value) ? '#4338ca' : '#d1d5db'}`,
                    background: interests.includes(t.value) ? '#e0e7ff' : '#fff',
                    color: interests.includes(t.value) ? '#4338ca' : '#374151',
                    borderRadius: 20,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
              }}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
