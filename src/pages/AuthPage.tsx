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
        background: 'var(--color-bg)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: 400,
          border: '1px solid var(--color-border-muted)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            Réseau Étudiant
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@campus.fr"
              required={mode === 'login'}
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                  Nom
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="input-base"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                  Campus
                </label>
                <select
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="input-base"
                  style={{ width: '100%', boxSizing: 'border-box' }}
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
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
              Mot de passe (mock)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Non vérifié en MVP"
              className="input-base"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem 1rem' }}
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {mode === 'login' ? (
            <>
              Pas de compte ?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', padding: 0, fontWeight: 600 }}
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
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', padding: 0, fontWeight: 600 }}
              >
                Se connecter
              </button>
            </>
          )}
        </p>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
          Comptes de démo : alice@campus.fr, bob@campus.fr, clara@campus.fr
        </p>
      </div>
    </div>
  )
}
