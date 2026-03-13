export default function NotificationsPlaceholder() {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-muted)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>Notifications</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem', fontSize: '0.95rem' }}>
        Le système de notifications sera implémenté dans une prochaine version.
      </p>
    </div>
  )
}
