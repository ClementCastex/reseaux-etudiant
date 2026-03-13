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
  imageUrl?: string | null
  startDate: string
  endDate: string
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

export interface Conversation {
  id: string
  isGroup: boolean
  name: string | null
  participants: { id: string; name: string; avatarUrl: string | null }[]
  lastMessage?: { text: string; createdAt: string; senderName: string }
}

export interface Message {
  id: string
  text: string
  createdAt: string
  senderId: string
  senderName: string
  senderAvatarUrl: string | null
}

export interface Friendship {
  id: string
  studentId: string
  friendId: string
}
