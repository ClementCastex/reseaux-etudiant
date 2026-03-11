# Réseau Étudiant - MVP Inter-campus

Application desktop simple de réseau social étudiant entre campus. MVP fonctionnel.

## Lancer le projet (avec base de données Prisma)

```bash
npm install
npm run db:migrate   # Créer les tables (si première fois)
npm run db:seed     # Données de démo
npm run dev:all     # Frontend + API (ou en 2 terminaux : npm run dev + npm run dev:api)
```

Puis ouvrir http://localhost:5173

- **Frontend** : Vite sur port 5173
- **API** : Express + Prisma sur port 3001 (proxifié via /api)

## Comptes de démonstration

- alice@campus.fr
- bob@campus.fr
- clara@campus.fr
- david@campus.fr

(Mot de passe non vérifié en MVP)

## Structure du projet

```
src/
├── api/            # Client API (fetch vers /api)
├── components/     # Composants réutilisables
├── pages/          # Pages de l'application
├── store/          # État global (Zustand)
├── data/           # Données mock (fallback)
└── types/          # Interfaces TypeScript

server/
└── index.ts        # API Express + Prisma

prisma/
├── schema.prisma   # Schéma DB (Campus, Student, Event)
├── seed.ts         # Données initiales
└── migrations/     # Migrations SQLite
```

## Fonctionnalités MVP

- Connexion / inscription (auth mockée)
- Profil étudiant (nom, campus, badge école)
- Création d'événements (titre, description, date, campus, type)
- Fil d'actualité des événements
- Détail événement + inscription / désinscription
- Placeholders : Messages, Notifications

## À faire ensuite

- Auth réelle (JWT, sessions)
- Messagerie
- Notifications
- Filtres recherche événements
- Système de signalement
- "Un ami participe" tag
