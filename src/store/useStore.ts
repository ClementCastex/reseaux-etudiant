import { create } from 'zustand'
import type { Student, Event, Campus } from '../types'
import { api } from '../api/client'

interface AppState {
  currentUser: Student | null
  events: Event[]
  students: Student[]
  campuses: Campus[]
  isLoading: boolean
  error: string | null
  setCurrentUser: (user: Student | null) => void
  loadFromApi: () => Promise<void>
  updateStudent: (studentId: string, data: Partial<Student>) => Promise<void>
  addStudent: (student: Student) => Promise<void>
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>
  deleteEvent: (eventId: string, creatorId: string) => Promise<void>
  participateToEvent: (eventId: string, studentId: string) => Promise<void>
  leaveEvent: (eventId: string, studentId: string) => Promise<void>
  isParticipating: (eventId: string, studentId: string) => boolean
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  events: [],
  students: [],
  campuses: [],
  isLoading: true,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),

  loadFromApi: async () => {
    set({ isLoading: true, error: null })
    try {
      const [campuses, students, events] = await Promise.all([
        api.campuses.list(),
        api.students.list(),
        api.events.list(),
      ])
      set({ campuses, students, events, isLoading: false, error: null })
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erreur de chargement',
        campuses: [],
        students: [],
        events: [],
      })
    }
  },

  updateStudent: async (studentId, data) => {
    try {
      const updated = await api.students.update(studentId, data)
      set((state) => {
        const students = state.students.map((s) => (s.id === studentId ? updated : s))
        const currentUser = state.currentUser?.id === studentId ? updated : state.currentUser
        return { students, currentUser }
      })
    } catch (err) {
      throw err
    }
  },

  addStudent: async (student) => {
    const created = await api.students.create({
      email: student.email,
      name: student.name,
      campusId: student.campusId,
      bio: student.bio ?? undefined,
      phone: student.phone ?? undefined,
      formation: student.formation ?? undefined,
      interests: student.interests ?? undefined,
    })
    set((state) => ({ students: [...state.students, created] }))
    return created
  },

  addEvent: async (event) => {
    try {
      const created = await api.events.create({
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        startDate: event.startDate,
        endDate: event.endDate,
        campusId: event.campusId,
        type: event.type,
        creatorId: event.creatorId,
        participantIds: event.participantIds,
      })
      set((state) => ({ events: [created, ...state.events] }))
    } catch (err) {
      throw err
    }
  },

  deleteEvent: async (eventId, creatorId) => {
    await api.events.delete(eventId, creatorId)
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }))
  },

  participateToEvent: async (eventId, studentId) => {
    try {
      const updated = await api.events.participate(eventId, studentId)
      set((state) => ({
        events: state.events.map((e) => (e.id === eventId ? updated : e)),
      }))
    } catch (err) {
      throw err
    }
  },

  leaveEvent: async (eventId, studentId) => {
    try {
      const updated = await api.events.leave(eventId, studentId)
      set((state) => ({
        events: state.events.map((e) => (e.id === eventId ? updated : e)),
      }))
    } catch (err) {
      throw err
    }
  },

  isParticipating: (eventId, studentId) => {
    const event = get().events.find((e) => e.id === eventId)
    return event?.participantIds.includes(studentId) ?? false
  },
}))
