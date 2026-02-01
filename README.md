# CogniTri - Interface de Surveillance de Tri Intelligent

## 📋 Description

CogniTri est une application web de monitoring en temps réel pour système de tri automatisé de déchets. Elle offre une interface interactive et intuitive permettant de visualiser l'activité du convoyeur, les statistiques de tri, et d'interagir avec un assistant IA pour l'analyse des données.

### 🎯 Fonctionnalités Principales

- **Dashboard en Temps Réel**
  - Visualisation des statistiques de tri par catégorie de déchets
  - Graphiques interactifs (radial, proportions, tendances)
  - Cartes de statistiques dynamiques avec animations

- **Simulation du Convoyeur**
  - Visualisation en temps réel du passage des déchets sur le convoyeur
  - Animation fluide avec React Spring
  - Détection et numérisation des objets

- **Assistant IA - CogniTri**
  - Chatbot intelligent alimenté par Gemini AI
  - Analyse des données de tri
  - Système d'alertes en temps réel
  - Support des requêtes en langage naturel

- **Journal d'Événements**
  - Suivi de tous les événements de tri
  - Défilement automatique des derniers événements
  - Horodatage précis

- **Page d'Historique**
  - Consultation de l'historique complet des événements
  - Pagination pour la performance
  - Chargement progressif des données

- **Paramètres & Thèmes**
  - Thème sombre/clair avec persistance locale
  - Interface personnalisable
  - Responsive design

## 🛠 Architecture Technique

### Technologies Utilisées
- **Framework**: React 19.1.0
- **Build Tool**: Create React App
- **Communication**: Socket.IO Client pour le temps réel
- **HTTP Client**: Axios
- **Animations**: React Spring
- **Visualisations**: Recharts
- **Markdown**: React Markdown
- **Icons**: React Icons

### Structure du Projet
```
src/
├── components/           # Composants réutilisables
│   ├── AIAssistant.js   # Assistant IA avec chat
│   ├── Conveyor.js      # Simulation du convoyeur
│   ├── EventTicker.js   # Défilement d'événements
│   ├── Header.js        # En-tête de l'application
│   ├── MainContent.js   # Contenu principal
│   ├── ProportionsChart.js  # Graphique des proportions
│   ├── RadialChart.js   # Graphique radial
│   ├── Settings.js      # Paramètres de l'application
│   ├── StatCard.js      # Carte de statistique
│   ├── Tabs.js          # Système d'onglets
│   ├── Vitals.js        # Statistiques vitales
│   └── Footer/          # Pied de page
├── pages/
│   └── HistoryPage.js   # Page d'historique complet
├── App.js               # Composant principal
└── index.js             # Point d'entrée
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js version 16 ou supérieure
- npm ou yarn
- Backend CogniTri en cours d'exécution

### Configuration

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Convoyeur_front
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```env
REACT_APP_API_URL=http://localhost:5000
```

> Pour la production, remplacez par l'URL de votre backend déployé (ex: Render, Heroku)

### Démarrage

#### Mode Développement
```bash
npm start
```
L'application sera accessible à l'adresse : **http://localhost:3000**

Le serveur de développement recharge automatiquement la page lors des modifications du code.

#### Mode Production
```bash
# Build optimisé pour la production
npm run build

# Les fichiers sont générés dans le dossier build/
```

### Tests
```bash
npm test
```

## 🔌 Communication Temps Réel

L'application utilise **Socket.IO** pour la communication bidirectionnelle avec le backend :

### Événements reçus :
- `connect` : Connexion établie avec le serveur
- `disconnect` : Déconnexion du serveur
- `atomic_update` : Mise à jour atomique des compteurs et événements
- `new_alert` : Nouvelle alerte de l'assistant IA

### API REST utilisées :
- `GET /api/waste-counts` : Récupération des compteurs initiaux
- `GET /api/events` : Récupération de l'historique des événements
- `POST /api/ask-gemini` : Interaction avec l'assistant IA

## 🎨 Fonctionnalités Détaillées

### Dashboard
- **StatCards** : Affichage animé des compteurs par catégorie (plastique, verre, métal, organique, papier)
- **RadialChart** : Visualisation circulaire des performances globales
- **ProportionsChart** : Graphique en barres des proportions de déchets
- **Vitals** : Indicateurs clés de performance en temps réel

### Convoyeur Intelligent
- Animation fluide du déplacement des déchets
- Effet de scan lors de la détection
- File d'attente pour gérer le flux d'objets
- Synchronisation parfaite avec les événements backend

### Assistant IA CogniTri
- Interface de chat conversationnelle
- Réponses formatées en Markdown
- Système d'alertes intelligentes
- Historique des conversations persistant

### Historique
- Pagination des événements (50 par page)
- Chargement progressif (infinite scroll)
- Filtrage par catégorie (à venir)
- Export des données (à venir)

## 🎨 Thèmes

L'application supporte deux thèmes :
- **Thème sombre** (par défaut) : Interface moderne avec fond sombre
- **Thème clair** : Interface lumineuse pour environnements éclairés

Le choix du thème est sauvegardé localement et persiste entre les sessions.

## 📱 Responsive Design

L'interface s'adapte automatiquement aux différentes tailles d'écran :
- Desktop (> 1024px)
- Tablette (768px - 1024px)
- Mobile (< 768px)

## 🔧 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'application en mode développement |
| `npm test` | Lance les tests unitaires |
| `npm run build` | Crée un build de production optimisé |
| `npm run eject` | Éjecte la configuration CRA (irréversible) |

## 📦 Déploiement

### Vercel (Recommandé pour le frontend)
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel
```

### Autres plateformes
- **Netlify** : Glisser-déposer le dossier `build/`
- **GitHub Pages** : Utiliser `gh-pages` package
- **AWS S3** : Héberger les fichiers statiques

> ⚠️ N'oubliez pas de configurer la variable d'environnement `REACT_APP_API_URL` avec l'URL de votre backend en production

## 🐛 Résolution de Problèmes

### Le convoyeur ne s'anime pas
- Vérifiez que le backend est bien démarré
- Vérifiez la connexion Socket.IO dans la console développeur
- Assurez-vous que `REACT_APP_API_URL` est correctement défini

### L'assistant IA ne répond pas
- Vérifiez la configuration de l'API Gemini dans le backend
- Consultez les logs du serveur backend
- Vérifiez votre connexion internet

### Les données ne se mettent pas à jour
- Actualisez la page (F5)
- Vérifiez l'état de connexion dans le header (indicateur vert/rouge)
- Redémarrez le backend et le frontend

## 📚 Documentation Additionnelle

- [Create React App Documentation](https://create-react-app.dev/)
- [React Documentation](https://react.dev/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Recharts Documentation](https://recharts.org/)

## 👥 Contribution

Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**Développé avec ❤️ pour un tri intelligent et durable**
