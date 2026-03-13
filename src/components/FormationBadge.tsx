interface FormationBadgeProps {
  formation: string | null | undefined
  size?: 'sm' | 'md'
}

export default function FormationBadge({ formation, size = 'sm' }: FormationBadgeProps) {
  if (!formation?.trim()) return null
  return (
    <span
      style={{
        fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 20,
        fontWeight: 500,
      }}
    >
      {formation}
    </span>
  )
}
