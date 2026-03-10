import { create } from 'zustand'
import type { Student, Event } from '../types'
import { mockEvents } from '../data/mockData'

interface AppState {
  currentUser: Student | null
  events: Event[]
  setCurrentUser: (user: Student | null) => void
  addEvent: (event: Event) => void
  participateToEvent: (eventId: string, studentId: string) => void
  leaveEvent: (eventId: string, studentId: string) => void
  isParticipating: (eventId: string, studentId: string) => boolean
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  events: mockEvents,

  setCurrentUser: (user) => set({ currentUser: user }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),

  participateToEvent: (eventId, studentId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId && !e.participantIds.includes(studentId)
          ? { ...e, participantIds: [...e.participantIds, studentId] }
          : e
      ),
    })),

  leaveEvent: (eventId, studentId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, participantIds: e.participantIds.filter((id) => id !== studentId) }
          : e
      ),
    })),

  isParticipating: (eventId, studentId) => {
    const event = get().events.find((e) => e.id === eventId)
    return event?.participantIds.includes(studentId) ?? false
  },
}))
