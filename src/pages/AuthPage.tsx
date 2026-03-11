import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Student } from '../types'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const campuses = useStore((s) => s.campuses)
  const [campusId, setCampusId] = useState('')
  useEffect(() => {
    if (campuses.length > 0 && !campusId) setCampusId(campuses[0].id)
  }, [campuses, campusId])
  const [error, setError] = useState('')

  const setCurrentUser = useStore((s) => s.setCurrentUser)
  const students = useStore((s) => s.students)
  const addStudent = useStore((s) => s.addStudent)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const student = students.find((s) => s.email === email)
    if (!student) {
      setError('Utilisateur non trouvé. Utilisez alice@campus.fr, bob@campus.fr, etc.')
      return
    }
    setCurrentUser(student)
    navigate('/')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Le nom est requis')
      return
    }
    try {
      const created = await addStudent({
        id: '',
        email: email || `user${Date.now()}@campus.fr`,
        name: name.trim(),
        campusId: campusId || campuses[0]?.id || '',
      })
      setCurrentUser(created)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inscription')
    }
  }

  const handleSubmit = mode === 'login' ? handleLogin : handleRegister

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <h1 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@campus.fr"
              required={mode === 'login'}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
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
            </>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem' }}>
              Mot de passe (mock)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Non vérifié en MVP"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: 4,
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          {mode === 'login' ? (
            <>
              Pas de compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0 }}
              >
                S'inscrire
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0 }}
              >
                Se connecter
              </button>
            </>
          )}
        </p>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          Comptes de démo : alice@campus.fr, bob@campus.fr, clara@campus.fr
        </p>
      </div>
    </div>
  )
}
