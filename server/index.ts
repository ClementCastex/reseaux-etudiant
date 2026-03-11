import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: true }))
app.use(express.json())

// Helpers pour formater les réponses
function formatStudent(s: { id: string; email: string; name: string; campusId: string; avatarUrl: string | null; bio: string | null; phone: string | null; formation: string | null; interests: string | null }) {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    campusId: s.campusId,
    avatarUrl: s.avatarUrl ?? null,
    bio: s.bio ?? null,
    phone: s.phone ?? null,
    formation: s.formation ?? null,
    interests: s.interests ? (JSON.parse(s.interests) as string[]) : null,
  }
}

function formatEvent(e: {
  id: string
  title: string
  description: string
  date: Date
  campusId: string
  type: string
  creatorId: string
  createdAt: Date
  participants: { id: string }[]
  campus?: { id: string; name: string }
  creator?: { id: string; name: string; email: string }
}) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date.toISOString(),
    campusId: e.campusId,
    type: e.type,
    creatorId: e.creatorId,
    participantIds: e.participants.map((p) => p.id),
    createdAt: e.createdAt.toISOString(),
    campus: e.campus,
    creator: e.creator,
  }
}

// === ROUTES ===

app.get('/api/campuses', async (_req, res) => {
  try {
    const campuses = await prisma.campus.findMany()
    res.json(campuses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/students', async (_req, res) => {
  try {
    const students = await prisma.student.findMany({ include: { campus: true } })
    res.json(students.map((s) => formatStudent(s)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { campus: true },
    })
    if (!student) return res.status(404).json({ error: 'Étudiant non trouvé' })
    res.json(formatStudent(student))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/students', async (req, res) => {
  try {
    const { email, name, campusId, bio, phone, formation, interests } = req.body
    if (!email || !name || !campusId) {
      return res.status(400).json({ error: 'email, name, campusId requis' })
    }
    const student = await prisma.student.create({
      data: {
        email,
        name,
        campusId,
        bio: bio ?? null,
        phone: phone ?? null,
        formation: formation ?? null,
        interests: interests ? JSON.stringify(interests) : null,
      },
    })
    res.status(201).json(formatStudent(student))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.patch('/api/students/:id', async (req, res) => {
  try {
    const { email, name, campusId, avatarUrl, bio, phone, formation, interests } = req.body
    const data: Record<string, unknown> = {}
    if (email != null) data.email = email
    if (name != null) data.name = name
    if (campusId != null) data.campusId = campusId
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl
    if (bio !== undefined) data.bio = bio
    if (phone !== undefined) data.phone = phone
    if (formation !== undefined) data.formation = formation
    if (interests !== undefined) data.interests = interests ? JSON.stringify(interests) : null

    const student = await prisma.student.update({
      where: { id: req.params.id },
      data,
    })
    res.json(formatStudent(student))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/students/email/:email', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { email: req.params.email },
      include: { campus: true },
    })
    if (!student) return res.status(404).json({ error: 'Étudiant non trouvé' })
    res.json(formatStudent(student))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/events', async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        participants: { select: { id: true } },
        campus: true,
        creator: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(events.map(formatEvent))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        participants: true,
        campus: true,
        creator: true,
      },
    })
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' })
    res.json(formatEvent(event))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, campusId, type, creatorId, participantIds } = req.body
    if (!title || !date || !campusId || !type || !creatorId) {
      return res.status(400).json({ error: 'title, date, campusId, type, creatorId requis' })
    }
    const participantIdsArray = Array.isArray(participantIds) ? participantIds : [creatorId]
    const event = await prisma.event.create({
      data: {
        title,
        description: description ?? '',
        date: new Date(date),
        campusId,
        type,
        creatorId,
        participants: {
          connect: participantIdsArray.map((id: string) => ({ id })),
        },
      },
      include: {
        participants: { select: { id: true } },
        campus: true,
        creator: true,
      },
    })
    res.status(201).json(formatEvent(event))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/events/:id/participate', async (req, res) => {
  try {
    const { studentId } = req.body
    if (!studentId) return res.status(400).json({ error: 'studentId requis' })
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { participants: { connect: { id: studentId } } },
      include: {
        participants: { select: { id: true } },
        campus: true,
        creator: true,
      },
    })
    res.json(formatEvent(event))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/events/:id/leave', async (req, res) => {
  try {
    const { studentId } = req.body
    if (!studentId) return res.status(400).json({ error: 'studentId requis' })
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { participants: { disconnect: { id: studentId } } },
      include: {
        participants: { select: { id: true } },
        campus: true,
        creator: true,
      },
    })
    res.json(formatEvent(event))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.listen(PORT, () => {
  console.log(`API prête sur http://localhost:${PORT}`)
})
