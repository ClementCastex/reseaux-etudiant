import { create } from 'zustand'
import type { Student, Event } from '../types'
import { mockEvents, mockStudents } from '../data/mockData'

interface AppState {
  currentUser: Student | null
  events: Event[]
  students: Student[]
  setCurrentUser: (user: Student | null) => void
  updateStudent: (studentId: string, data: Partial<Student>) => void
  addStudent: (student: Student) => void
  addEvent: (event: Event) => void
  participateToEvent: (eventId: string, studentId: string) => void
  leaveEvent: (eventId: string, studentId: string) => void
  isParticipating: (eventId: string, studentId: string) => boolean
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  events: mockEvents,
  students: mockStudents,

  setCurrentUser: (user) => set({ currentUser: user }),

  updateStudent: (studentId, data) =>
    set((state) => {
      const updated = state.students.map((s) =>
        s.id === studentId ? { ...s, ...data } : s
      )
      const currentUser =
        state.currentUser?.id === studentId
          ? { ...state.currentUser, ...data }
          : state.currentUser
      return { students: updated, currentUser }
    }),

  addStudent: (student) =>
    set((state) => ({
      students: [...state.students, student],
    })),

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
