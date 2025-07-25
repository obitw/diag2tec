<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  character: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['game-over', 'update-score']);

// Constantes du jeu
const GAME_DURATION = 30000; // 30 secondes
const PLAYER_SPEED = 10; // Vitesse du joueur légèrement réduite pour plus de défi
const BASE_OBSTACLE_SPEED = 5; // Vitesse de base des obstacles augmentée
const OBSTACLE_SPEED_VARIATION = 3; // Plus de variation de vitesse entre les obstacles
const MIN_OBSTACLE_SPAWN_RATE = 300; // Plus d'obstacles qui apparaissent
const MAX_OBSTACLE_SPAWN_RATE = 600; // Taux d'apparition maximum réduit
const DIFFICULTY_INCREASE_INTERVAL = 5000; // La difficulté augmente toutes les 5 secondes

// État du jeu
const gameArea = ref(null);
const gameLoopId = ref(null);
const obstacleSpawner = ref(null);
const obstacles = ref([]);
const gameTimeLeft = ref(GAME_DURATION);
const score = ref(0);

// Variables pour la difficulté progressive
const gameStartTime = ref(0);
const lastDifficultyIncrease = ref(0);
const currentSpawnRate = ref(MAX_OBSTACLE_SPAWN_RATE);

const player = ref({
  x: 0,
  y: 0,
  width: 60, 
  height: 80, 
  speed: PLAYER_SPEED,
  isMovingLeft: false,
  isMovingRight: false
});

// Charger les obstacles spécifiques au personnage
const characterObstacles = computed(() => {
  // Charger les images d'obstacles spécifiques au personnage
  try {
    // Importer dynamiquement les images du dossier correspondant au personnage
    const obstacles = [];
    for (let i = 1; i <= 3; i++) {
      try {
        const imageUrl = new URL(`/src/assets/obstacles/${props.character.id}/${props.character.id}${i}.png`, import.meta.url).href;
        obstacles.push({
          id: `obstacle${i}`,
          src: imageUrl
        });
      } catch (e) {
        console.warn(`Impossible de charger l'obstacle ${i} pour ${props.character.id}:`, e);
      }
    }
    
    // Si aucun obstacle n'a pu être chargé, on utilise des carrés colorés en fallback
    if (obstacles.length === 0) {
      console.warn('Aucun obstacle trouvé, utilisation des obstacles par défaut');
      return [
        { id: 'obstacle1', color: '#FF5252' },
        { id: 'obstacle2', color: '#4CAF50' },
        { id: 'obstacle3', color: '#2196F3' }
      ];
    }
    
    return obstacles;
  } catch (error) {
    console.error('Erreur lors du chargement des obstacles:', error);
    return [];
  }
});

// Gestion des contrôles
const handleKeyDown = (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.value.isMovingLeft = true;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    player.value.isMovingRight = true;
  }
};

const handleKeyUp = (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    player.value.isMovingLeft = false;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    player.value.isMovingRight = false;
  }
};

// Gestion du jeu
const updatePlayerPosition = () => {
  if (!gameArea.value) return;
  
  const gameAreaWidth = gameArea.value.offsetWidth;
  
  if (player.value.isMovingLeft && player.value.x > 0) {
    player.value.x = Math.max(0, player.value.x - player.value.speed);
  }
  if (player.value.isMovingRight && player.value.x < gameAreaWidth - player.value.width) {
    player.value.x = Math.min(gameAreaWidth - player.value.width, player.value.x + player.value.speed);
  }
};

const spawnObstacle = () => {
  if (!gameArea.value || characterObstacles.value.length === 0) return;
  
  const gameAreaWidth = gameArea.value.offsetWidth;
  const obstacleSize = 50 + Math.random() * 20; // Taille aléatoire entre 50 et 70px
  const x = Math.random() * (gameAreaWidth - obstacleSize);
  
  // Choisir un obstacle aléatoire pour ce personnage
  const obstacleType = characterObstacles.value[Math.floor(Math.random() * characterObstacles.value.length)];
  
  // Calculer la vitesse en fonction de la difficulté actuelle
  const difficulty = calculateDifficulty();
  const speed = BASE_OBSTACLE_SPEED * difficulty + Math.random() * OBSTACLE_SPEED_VARIATION;
  
  // Créer un nouvel obstacle
  const newObstacle = {
    id: Date.now() + Math.random(), // ID unique
    x: Math.round(x), // Arrondir pour éviter le flou de sous-pixel
    y: -obstacleSize, // Commence au-dessus de l'écran
    width: obstacleSize,
    height: obstacleSize,
    speed: speed, // Vitesse basée sur la difficulté
    type: obstacleType.id,
    rotation: Math.random() * 360, // Rotation initiale aléatoire
    lastUpdate: Date.now() // Timestamp pour le calcul du delta
  };
  
  // Ajouter l'URL de l'image si disponible, sinon utiliser une couleur
  if (obstacleType.src) {
    newObstacle.src = obstacleType.src;
  } else if (obstacleType.color) {
    newObstacle.color = obstacleType.color;
  } else {
    // Couleur par défaut si aucune image ni couleur n'est définie
    newObstacle.color = '#FF5252';
  }
  
  obstacles.value.push(newObstacle);
};

const updateObstacles = () => {
  const gameAreaHeight = gameArea.value.offsetHeight;
  const now = Date.now();
  
  // Mettre à jour la position des obstacles
  obstacles.value = obstacles.value.map(obstacle => {
    // Calculer le temps écoulé depuis la dernière frame
    const deltaTime = now - (obstacle.lastUpdate || now);
    obstacle.lastUpdate = now;
    
    // Mettre à jour la position en fonction du temps écoulé
    // pour un mouvement plus fluide indépendant du taux de rafraîchissement
    return {
      ...obstacle,
      y: obstacle.y + (obstacle.speed * (deltaTime / 16)) // Normaliser à ~60fps
    };
  }).filter(obstacle => {
    // Vérifier les collisions avec le joueur
    if (checkCollision(player.value, obstacle)) {
      endGame(false); // Perdu
      return false;
    }
    
    // Supprimer les obstacles qui sont sortis de l'écran
    return obstacle.y < gameAreaHeight;
  });
};

const checkCollision = (player, obstacle) => {
  return player.x < obstacle.x + obstacle.width &&
         player.x + player.width > obstacle.x &&
         player.y < obstacle.y + obstacle.height &&
         player.y + player.height > obstacle.y;
};

const updateGameTime = () => {
  const currentTime = Date.now();
  const elapsed = currentTime - gameStartTime.value;
  gameTimeLeft.value = Math.max(0, GAME_DURATION - elapsed);
  
  // Mettre à jour le score (temps écoulé en secondes)
  const newScore = Math.floor(elapsed / 1000);
  if (newScore !== score.value) {
    score.value = newScore;
    emit('update-score', newScore);
  }
  
  // Vérifier si le temps est écoulé
  if (gameTimeLeft.value <= 0) {
    endGame(true); // Gagné
  }
};

const calculateDifficulty = () => {
  if (!gameStartTime.value) return 1.0;
  
  const elapsed = Date.now() - gameStartTime.value;
  // Augmente progressivement la difficulté jusqu'à 1.8x la difficulté de départ
  return Math.min(1.8, 1.0 + (elapsed / (GAME_DURATION * 1.2)));
};

const gameLoop = () => {
  const now = Date.now();
  
  // Augmenter progressivement la difficulté
  if (now - lastDifficultyIncrease.value > DIFFICULTY_INCREASE_INTERVAL) {
    currentSpawnRate.value = Math.max(
      MIN_OBSTACLE_SPAWN_RATE,
      MAX_OBSTACLE_SPAWN_RATE / calculateDifficulty()
    );
    lastDifficultyIncrease.value = now;
  }
  
  updatePlayerPosition();
  updateObstacles();
  updateGameTime();
  gameLoopId.value = requestAnimationFrame(gameLoop);
};

const endGame = (isWin) => {
  // Arrêter les boucles de jeu
  cancelAnimationFrame(gameLoopId.value);
  clearInterval(obstacleSpawner.value);
  
  // Émettre l'événement de fin de jeu
  emit('game-over', {
    win: isWin,
    score: score.value,
    time: Math.floor((GAME_DURATION - gameTimeLeft.value) / 1000)
  });
};

// Initialisation du jeu
const initGame = () => {
  // Réinitialiser l'état du jeu
  obstacles.value = [];
  player.value = {
    x: (gameArea.value.clientWidth - 80) / 2, // Centrer le joueur horizontalement
    y: gameArea.value.clientHeight - 120, // Positionner le joueur en haut avec une marge
    width: 80,
    height: 100,
    speed: PLAYER_SPEED,
    isMovingLeft: false,
    isMovingRight: false
  };
  
  // Initialiser les variables de difficulté
  gameStartTime.value = Date.now();
  lastDifficultyIncrease.value = Date.now();
  currentSpawnRate.value = MAX_OBSTACLE_SPAWN_RATE;
  gameTimeLeft.value = GAME_DURATION;
  score.value = 0;
  
  // Démarrer les boucles de jeu
  gameLoop();
  
  // Fonction pour gérer le spawn des obstacles avec un intervalle dynamique
  const spawnLoop = () => {
    if (document.visibilityState === 'visible') {
      spawnObstacle();
    }
    const nextSpawn = currentSpawnRate.value * (0.8 + Math.random() * 0.4); // Variation aléatoire
    obstacleSpawner.value = setTimeout(spawnLoop, nextSpawn);
  };
  
  // Démarrer la boucle de spawn
  spawnLoop();
};

// Gestion du cycle de vie du composant
onMounted(() => {
  // Ajouter les écouteurs d'événements
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Démarrer le jeu
  initGame();
});

onUnmounted(() => {
  // Nettoyer les écouteurs d'événements
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  
  // Arrêter les boucles de jeu
  cancelAnimationFrame(gameLoopId.value);
  clearInterval(obstacleSpawner.value);
});
</script>

<template>
  <div class="game-container">
    <div class="game-header mb-4 flex justify-between items-center">
      <div class="character-info flex items-center">
        <img 
          :src="character.image" 
          :alt="character.name" 
          class="w-12 h-12 rounded-full mr-3 border-2 border-white"
        />
        <div>
          <h3 class="text-xl font-bold">{{ character.name }}</h3>
          <div class="text-sm opacity-80">Score: {{ score }}</div>
        </div>
      </div>
      
      <div class="timer text-2xl font-bold">
        {{ Math.ceil(gameTimeLeft / 1000) }}s
      </div>
    </div>
    
    <div 
      ref="gameArea" 
      class="game-area relative mx-auto bg-black bg-opacity-30 rounded-lg overflow-hidden"
      :style="{ 
        width: '98%',
        maxWidth: '1200px',
        height: '50vh',
        minHeight: '400px'
      }"
    >
      <!-- Joueur -->
      <div 
        class="player absolute transition-transform"
        :style="{
          left: `${player.x}px`,
          top: `${player.y}px`,
          width: `${player.width}px`,
          height: `${player.height}px`,
          backgroundImage: `url(${character.image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center bottom',
          imageRendering: 'pixelated',
          transform: 'scaleX(-1)', // Inverser l'image pour qu'elle regarde vers la droite
          zIndex: 10
        }"
      ></div>
      
      <!-- Obstacles -->
      <div 
        v-for="obstacle in obstacles" 
        :key="obstacle.id"
        class="obstacle absolute rounded-md shadow-lg overflow-hidden will-change-transform"
        :style="{
          transform: `translate3d(${Math.round(obstacle.x)}px, ${Math.round(obstacle.y)}px, 0) rotate(${obstacle.rotation || 0}deg)`,
          width: `${obstacle.width}px`,
          height: `${obstacle.height}px`,
          backgroundColor: obstacle.color || 'transparent',
          backgroundImage: obstacle.src ? `url(${obstacle.src})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: obstacle.color ? '2px solid white' : 'none',
          transition: 'transform 0.1s linear',
          zIndex: 5,
          imageRendering: 'pixelated',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }"
      ></div>
    </div>
    
    <div class="game-controls mt-4 text-center">
      <p class="text-sm opacity-80 mb-2">Utilisez les flèches ← → ou A/D pour vous déplacer</p>
      <button 
        @click="endGame(false)" 
        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
      >
        Abandonner
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-area {
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.player {
  transition: left 0.1s ease-out;
  z-index: 10;
  will-change: transform;
  transform-origin: center bottom;
}

.obstacle {
  z-index: 5;
  will-change: transform;
}
</style>
