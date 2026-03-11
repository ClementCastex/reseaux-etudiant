import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const [c1, c2, c3] = await Promise.all([
    prisma.campus.upsert({
      where: { name: 'Campus Central' },
      create: { name: 'Campus Central' },
      update: {},
    }),
    prisma.campus.upsert({
      where: { name: 'Campus Nord' },
      create: { name: 'Campus Nord' },
      update: {},
    }),
    prisma.campus.upsert({
      where: { name: 'Campus Sud' },
      create: { name: 'Campus Sud' },
      update: {},
    }),
  ])

  const alice = await prisma.student.upsert({
    where: { email: 'alice@campus.fr' },
    create: {
      email: 'alice@campus.fr',
      name: 'Alice Martin',
      campusId: c1.id,
      bio: "Fan de soirées et d'événements culturels !",
      formation: 'Licence Informatique',
      interests: JSON.stringify(['soiree', 'culture']),
    },
    update: {},
  })

  const bob = await prisma.student.upsert({
    where: { email: 'bob@campus.fr' },
    create: {
      email: 'bob@campus.fr',
      name: 'Bob Dupont',
      campusId: c1.id,
      bio: "Passionné de sport et d'équipe.",
      phone: '06 12 34 56 78',
      formation: 'Master STAPS',
      interests: JSON.stringify(['sport']),
    },
    update: {},
  })

  const clara = await prisma.student.upsert({
    where: { email: 'clara@campus.fr' },
    create: {
      email: 'clara@campus.fr',
      name: 'Clara Bernard',
      campusId: c2.id,
      bio: "Étudiante en école d'ingé, j'adore les groupes de révision.",
      formation: "École d'ingénieur",
      interests: JSON.stringify(['etude', 'culture']),
    },
    update: {},
  })

  const david = await prisma.student.upsert({
    where: { email: 'david@campus.fr' },
    create: {
      email: 'david@campus.fr',
      name: 'David Leroy',
      campusId: c3.id,
      formation: 'Licence Éco-Gestion',
      interests: JSON.stringify(['soiree', 'sport']),
    },
    update: {},
  })

  await prisma.event.create({
    data: {
      title: 'Soirée de rentrée',
      description: 'Venez fêter la rentrée tous ensemble !',
      startDate: new Date('2025-03-15T19:00:00'),
      endDate: new Date('2025-03-15T23:00:00'),
      campusId: c1.id,
      type: 'soiree',
      creatorId: alice.id,
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }],
      },
    },
  })

  await prisma.event.create({
    data: {
      title: 'Session sport 5-a-side',
      description: 'Match de foot entre campus.',
      startDate: new Date('2025-03-18T14:00:00'),
      endDate: new Date('2025-03-18T16:00:00'),
      campusId: c1.id,
      type: 'sport',
      creatorId: bob.id,
      participants: {
        connect: [{ id: bob.id }, { id: clara.id }],
      },
    },
  })

  await prisma.event.create({
    data: {
      title: 'Groupe de révision examen',
      description: 'Révision collective pour les partiels.',
      startDate: new Date('2025-03-20T09:00:00'),
      endDate: new Date('2025-03-20T12:00:00'),
      campusId: c2.id,
      type: 'etude',
      creatorId: clara.id,
      participants: {
        connect: [{ id: clara.id }],
      },
    },
  })

  console.log('Seed terminé : campuses, étudiants, événements créés.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
