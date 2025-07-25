<script setup>
import { ref, computed } from 'vue';
import CharacterSelect from './components/CharacterSelect.vue';
import GameScreen from './components/GameScreen.vue';
import GameOver from './components/GameOver.vue';

// État de l'application
const gameState = ref('character-select'); // 'character-select', 'playing', 'game-over'
const selectedCharacter = ref(null);
const score = ref(0);
const gameResult = ref(null);

// Fonction pour démarrer le jeu avec un personnage
const startGame = (character) => {
  selectedCharacter.value = character;
  gameState.value = 'playing';
  score.value = 0;
};

// Fonction pour terminer le jeu
const endGame = (result) => {
  gameResult.value = result;
  gameState.value = 'game-over';
};

// Fonction pour recommencer
const restartGame = () => {
  gameState.value = 'character-select';
  selectedCharacter.value = null;
  gameResult.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
    <header class="container mx-auto px-4 py-6">
      <h1 class="text-4xl font-bold text-center mb-2">Diag2Tec Adventure</h1>
      <p class="text-center text-xl mb-6">Évitez les obstacles et survivez 30 secondes !</p>
      
      <div v-if="gameState === 'character-select'" class="mt-8">
        <CharacterSelect @select-character="startGame" />
      </div>
      
      <div v-else-if="gameState === 'playing'" class="mt-8">
        <GameScreen 
          :character="selectedCharacter" 
          @game-over="endGame" 
          @update-score="(newScore) => score = newScore"
        />
      </div>
      
      <div v-else-if="gameState === 'game-over'" class="mt-8">
        <GameOver 
          :result="gameResult" 
          :character="selectedCharacter"
          :score="score"
          @restart="restartGame" 
        />
      </div>
    </header>
  </div>
</template>

<style>
/* Styles globaux */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Animation de fond */
.bg-animate {
  animation: gradient 15s ease infinite;
  background-size: 400% 400%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
