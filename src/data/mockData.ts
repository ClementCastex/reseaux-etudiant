import type { Campus, Student, Event } from '../types'

export const mockCampuses: Campus[] = [
  { id: 'c1', name: 'Campus Central' },
  { id: 'c2', name: 'Campus Nord' },
  { id: 'c3', name: 'Campus Sud' },
]

export const mockStudents: Student[] = [
  {
    id: 's1',
    email: 'alice@campus.fr',
    name: 'Alice Martin',
    campusId: 'c1',
    bio: 'Fan de soirées et d\'événements culturels !',
    formation: 'Licence Informatique',
    interests: ['soiree', 'culture'],
  },
  {
    id: 's2',
    email: 'bob@campus.fr',
    name: 'Bob Dupont',
    campusId: 'c1',
    bio: 'Passionné de sport et d\'équipe.',
    phone: '06 12 34 56 78',
    formation: 'Master STAPS',
    interests: ['sport'],
  },
  {
    id: 's3',
    email: 'clara@campus.fr',
    name: 'Clara Bernard',
    campusId: 'c2',
    bio: 'Étudiante en école d\'ingé, j\'adore les groupes de révision.',
    formation: 'École d\'ingénieur',
    interests: ['etude', 'culture'],
  },
  {
    id: 's4',
    email: 'david@campus.fr',
    name: 'David Leroy',
    campusId: 'c3',
    formation: 'Licence Éco-Gestion',
    interests: ['soiree', 'sport'],
  },
]

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Soirée de rentrée',
    description: 'Venez fêter la rentrée tous ensemble !',
    startDate: '2025-03-15T19:00:00',
    endDate: '2025-03-15T23:00:00',
    campusId: 'c1',
    type: 'soiree',
    creatorId: 's1',
    participantIds: ['s1', 's2'],
    createdAt: '2025-03-09T10:00:00',
  },
  {
    id: 'e2',
    title: 'Session sport 5-a-side',
    description: 'Match de foot entre campus.',
    startDate: '2025-03-18T14:00:00',
    endDate: '2025-03-18T16:00:00',
    campusId: 'c1',
    type: 'sport',
    creatorId: 's2',
    participantIds: ['s2', 's3'],
    createdAt: '2025-03-09T11:00:00',
  },
  {
    id: 'e3',
    title: 'Groupe de révision examen',
    description: 'Révision collective pour les partiels.',
    startDate: '2025-03-20T09:00:00',
    endDate: '2025-03-20T12:00:00',
    campusId: 'c2',
    type: 'etude',
    creatorId: 's3',
    participantIds: ['s3'],
    createdAt: '2025-03-10T08:00:00',
  },
]
