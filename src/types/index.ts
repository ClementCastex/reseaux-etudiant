export interface Campus {
  id: string
  name: string
}

export interface Student {
  id: string
  email: string
  name: string
  campusId: string
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
