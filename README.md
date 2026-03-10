# Réseau Étudiant - MVP Inter-campus

Application desktop simple de réseau social étudiant entre campus. MVP fonctionnel.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173

## Comptes de démonstration

- alice@campus.fr
- bob@campus.fr
- clara@campus.fr
- david@campus.fr

(Mot de passe non vérifié en MVP)

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/          # Pages de l'application
├── store/          # État global (Zustand)
├── data/            # Données mockées
└── types/           # Interfaces TypeScript
```

## Fonctionnalités MVP

- Connexion / inscription (auth mockée)
- Profil étudiant (nom, campus, badge école)
- Création d'événements (titre, description, date, campus, type)
- Fil d'actualité des événements
- Détail événement + inscription / désinscription
- Placeholders : Messages, Notifications

## À faire ensuite

- Backend (API, BDD)
- Auth réelle
- Messagerie
- Notifications
- Filtres recherche événements
- Système de signalement
- "Un ami participe" tag
