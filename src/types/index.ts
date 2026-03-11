export interface Campus {
  id: string
  name: string
}

export interface Student {
  id: string
  email: string
  name: string
  campusId: string
  /** URL base64 ou externe de la photo de profil */
  avatarUrl?: string | null
  /** Bio courte / description (optionnel) */
  bio?: string | null
  /** Numéro de téléphone (optionnel) */
  phone?: string | null
  /** Formation / filière d'études (ex: Licence Info, Master MEEF) */
  formation?: string | null
  /** Intérêts / centres d'intérêt (pour matcher les événements) */
  interests?: string[] | null
}

export type EventType = 'soiree' | 'sport' | 'etude' | 'culture' | 'autre'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  campusId: string
  type: EventType
  creatorId: string
  participantIds: string[]
  createdAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  currentUser: Student | null
}
