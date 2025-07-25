# Diag2Tec Adventure 

Un jeu d'esquive personnalisé créé avec Vue.js et Tailwind CSS pour l'équipe Diag2Tec.

## Fonctionnalités

- Sélection de personnage parmi les membres de l'équipe
- Jeu d'esquive avec des obstacles personnalisés
- Chronomètre et score
- Écrans d'accueil et de fin de jeu
- Design moderne et réactif
- Animation fluide

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone https://github.com/votre-utilisateur/diag2tec-adventure.git
   cd diag2tec-adventure
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Lancer le serveur de développement**
   ```sh
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   
   Le jeu sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000)

## Construction pour la production

Pour créer une version de production optimisée :

```sh
npm run build
```

Les fichiers compilés seront disponibles dans le dossier `dist/`.

## Déploiement sur GitHub Pages

1. **Construire le projet**
   ```sh
   npm run build
   ```

2. **Installer gh-pages** (si ce n'est pas déjà fait)
   ```sh
   npm install --save-dev gh-pages
   ```

3. **Déployer**
   ```sh
   npm run deploy
   ```

Le jeu sera disponible à l'adresse :
`https://votre-utilisateur.github.io/diag2tec-adventure/`

## Comment jouer

1. **Sélectionnez un personnage** parmi les membres de l'équipe
2. **Évitez les obstacles** en vous déplaçant avec les touches fléchées (← →) ou A/D
3. **Survivez pendant 30 secondes** pour gagner la partie
4. **Découvrez le message personnalisé** à la fin du jeu

## Personnalisation

### Ajouter un nouveau personnage

1. Ajoutez l'image du personnage dans `src/assets/characters/`
2. Créez un dossier avec le nom du personnage dans `src/assets/obstacles/`
3. Ajoutez les images des obstacles spécifiques à ce personnage
4. Mettez à jour le tableau `characters` dans `src/components/CharacterSelect.vue`

### Modifier les messages

Les messages de fin de jeu peuvent être personnalisés dans le composant `GameOver.vue`.

## Structure du projet

```
src/
├── assets/               # Fichiers statiques (images, polices, etc.)
│   ├── characters/       # Images des personnages jouables
│   └── obstacles/        # Images des obstacles par personnage
├── components/           # Composants Vue
│   ├── CharacterSelect.vue # Sélection du personnage
│   ├── GameScreen.vue    # Écran de jeu principal
│   └── GameOver.vue      # Écran de fin de jeu
├── App.vue               # Composant racine
└── main.js               # Point d'entrée de l'application
```

## Technologies utilisées

- [Vue.js 3](https://v3.vuejs.org/) - Framework JavaScript progressif
- [Vite](https://vitejs.dev/) - Outil de build et serveur de développement
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- [GitHub Pages](https://pages.github.com/) - Hébergement du site

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Remerciements

Un grand merci à toute l'équipe Diag2Tec pour cette belle aventure !

---

Développé avec ❤️ pour l'équipe Diag2Tec
