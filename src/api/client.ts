import type { Campus, Student, Event, EventType, Conversation, Message } from '../types'

const API_BASE = '/api'

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  campuses: {
    list: () => fetchApi<Campus[]>(`/campuses`),
  },
  students: {
    list: () => fetchApi<Student[]>(`/students`),
    get: (id: string) => fetchApi<Student>(`/students/${id}`),
    getByEmail: (email: string) =>
      fetchApi<Student>(`/students/email/${encodeURIComponent(email)}`),
    create: (data: { email: string; name: string; campusId: string; bio?: string; phone?: string; formation?: string; interests?: string[] }) =>
      fetchApi<Student>(`/students`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Student>) =>
      fetchApi<Student>(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  events: {
    list: () => fetchApi<Event[]>(`/events`),
    get: (id: string) => fetchApi<Event>(`/events/${id}`),
    create: (data: {
      title: string
      description?: string
      imageUrl?: string | null
      startDate: string
      endDate: string
      campusId: string
      type: EventType
      creatorId: string
      participantIds?: string[]
    }) => fetchApi<Event>(`/events`, { method: 'POST', body: JSON.stringify(data) }),
    participate: (eventId: string, studentId: string) =>
      fetchApi<Event>(`/events/${eventId}/participate`, { method: 'POST', body: JSON.stringify({ studentId }) }),
    leave: (eventId: string, studentId: string) =>
      fetchApi<Event>(`/events/${eventId}/leave`, { method: 'POST', body: JSON.stringify({ studentId }) }),
    delete: (eventId: string, creatorId: string) =>
      fetchApi<void>(`/events/${eventId}`, { method: 'DELETE', body: JSON.stringify({ creatorId }) }),
  },
  friendships: {
    list: (studentId: string) =>
      fetchApi<Student[]>(`/students/${studentId}/friends`),
    add: (studentId: string, friendId: string) =>
      fetchApi<Student>(`/friendships`, { method: 'POST', body: JSON.stringify({ studentId, friendId }) }),
    remove: (studentId: string, friendId: string) =>
      fetchApi<void>(`/friendships`, { method: 'DELETE', body: JSON.stringify({ studentId, friendId }) }),
  },
  conversations: {
    list: (studentId: string) =>
      fetchApi<Conversation[]>(`/conversations?studentId=${encodeURIComponent(studentId)}`),
    create: (participantIds: string[], isGroup?: boolean, name?: string) =>
      fetchApi<Conversation>(`/conversations`, {
        method: 'POST',
        body: JSON.stringify({ participantIds, isGroup, name }),
      }),
    getMessages: (conversationId: string, studentId: string) =>
      fetchApi<Message[]>(`/conversations/${conversationId}/messages?studentId=${encodeURIComponent(studentId)}`),
    sendMessage: (conversationId: string, senderId: string, text: string) =>
      fetchApi<Message>(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ senderId, text }),
      }),
  },
}
