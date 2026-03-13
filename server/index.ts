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
  imageUrl?: string | null
  startDate: Date
  endDate: Date
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
    imageUrl: e.imageUrl ?? null,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate.toISOString(),
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
    const { title, description, imageUrl, startDate, endDate, campusId, type, creatorId, participantIds } = req.body
    if (!title || !startDate || !endDate || !campusId || !type || !creatorId) {
      return res.status(400).json({ error: 'title, startDate, endDate, campusId, type, creatorId requis' })
    }
    const participantIdsArray = Array.isArray(participantIds) ? participantIds : [creatorId]
    const event = await prisma.event.create({
      data: {
        title,
        description: description ?? '',
        imageUrl: imageUrl ?? null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { creatorId } = req.body
    if (!creatorId) return res.status(400).json({ error: 'creatorId requis' })

    const event = await prisma.event.findUnique({
      where: { id },
      select: { creatorId: true, startDate: true },
    })
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' })
    if (event.creatorId !== creatorId) {
      return res.status(403).json({ error: 'Seul le créateur peut supprimer cet événement' })
    }

    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    if (event.startDate < sevenDaysFromNow) {
      return res.status(403).json({
        error: 'Suppression impossible : moins de 7 jours avant le début de l\'événement',
      })
    }

    await prisma.event.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// === AMIS (FRIENDSHIPS) ===

app.get('/api/students/:id/friends', async (req, res) => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: { studentId: req.params.id },
      include: { friend: true },
    })
    res.json(friendships.map((f) => formatStudent(f.friend)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/friendships', async (req, res) => {
  try {
    const { studentId, friendId } = req.body
    if (!studentId || !friendId || studentId === friendId) {
      return res.status(400).json({ error: 'studentId et friendId requis (distincts)' })
    }
    await prisma.friendship.create({
      data: { studentId, friendId },
    })
    const friend = await prisma.student.findUnique({ where: { id: friendId } })
    res.status(201).json(formatStudent(friend!))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.delete('/api/friendships', async (req, res) => {
  try {
    const { studentId, friendId } = req.body
    if (!studentId || !friendId) {
      return res.status(400).json({ error: 'studentId et friendId requis' })
    }
    await prisma.friendship.deleteMany({
      where: { studentId, friendId },
    })
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// === MESSAGERIE ===

interface FormattedConversation {
  id: string
  isGroup: boolean
  name: string | null
  participants: { id: string; name: string; avatarUrl: string | null }[]
  lastMessage?: { text: string; createdAt: string; senderName: string }
}

app.get('/api/conversations', async (req, res) => {
  try {
    const { studentId } = req.query
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'studentId requis' })
    }
    const parts = await prisma.conversationParticipant.findMany({
      where: { studentId },
      include: {
        conversation: {
          include: {
            participants: { include: { student: true } },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { sender: true },
            },
          },
        },
      },
    })
    const formatted: FormattedConversation[] = parts.map((p) => {
      const c = p.conversation
      const lastMsg = c.messages[0]
      return {
        id: c.id,
        isGroup: c.isGroup,
        name: c.name,
        participants: c.participants.map((x) => ({
          id: x.student.id,
          name: x.student.name,
          avatarUrl: x.student.avatarUrl,
        })),
        lastMessage: lastMsg
          ? {
              text: lastMsg.text,
              createdAt: lastMsg.createdAt.toISOString(),
              senderName: lastMsg.sender.name,
            }
          : undefined,
      }
    })
    res.json(formatted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.get('/api/conversations/:id/messages', async (req, res) => {
  try {
    const { studentId } = req.query
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'studentId requis' })
    }
    const part = await prisma.conversationParticipant.findFirst({
      where: { conversationId: req.params.id, studentId },
    })
    if (!part) return res.status(403).json({ error: 'Non autorisé' })
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    })
    res.json(
      messages.map((m) => ({
        id: m.id,
        text: m.text,
        createdAt: m.createdAt.toISOString(),
        senderId: m.senderId,
        senderName: m.sender.name,
        senderAvatarUrl: m.sender.avatarUrl,
      }))
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/conversations', async (req, res) => {
  try {
    const { participantIds, isGroup, name } = req.body
    if (!Array.isArray(participantIds) || participantIds.length < 1) {
      return res.status(400).json({ error: 'participantIds requis (array)' })
    }
    const conv = await prisma.conversation.create({
      data: {
        isGroup: !!isGroup,
        name: name ?? null,
        participants: {
          create: participantIds.map((id: string) => ({ studentId: id })),
        },
      },
      include: { participants: { include: { student: true } } },
    })
    res.status(201).json({
      id: conv.id,
      isGroup: conv.isGroup,
      name: conv.name,
      participants: conv.participants.map((x) => ({
        id: x.student.id,
        name: x.student.name,
        avatarUrl: x.student.avatarUrl,
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.post('/api/conversations/:id/messages', async (req, res) => {
  try {
    const { senderId, text } = req.body
    if (!senderId || !text || typeof text !== 'string') {
      return res.status(400).json({ error: 'senderId et text requis' })
    }
    const part = await prisma.conversationParticipant.findFirst({
      where: { conversationId: req.params.id, studentId: senderId },
    })
    if (!part) return res.status(403).json({ error: 'Non autorisé' })
    const msg = await prisma.message.create({
      data: { conversationId: req.params.id, senderId, text },
      include: { sender: true },
    })
    res.status(201).json({
      id: msg.id,
      text: msg.text,
      createdAt: msg.createdAt.toISOString(),
      senderId: msg.senderId,
      senderName: msg.sender.name,
      senderAvatarUrl: msg.sender.avatarUrl,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

app.listen(PORT, () => {
  console.log(`API prête sur http://localhost:${PORT}`)
})
