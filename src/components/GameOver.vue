<script setup>
import { computed } from 'vue';

const props = defineProps({
  result: {
    type: Object,
    required: true
  },
  character: {
    type: Object,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['restart']);

// Messages de fin de jeu personnalisés
const gameOverMessages = {
  win: {
    title: 'Félicitations !',
    message: (name) => `Bravo ${name} ! Tu as survécu 30 secondes !`,
    emoji: '🎉'
  },
  lose: {
    title: 'Dommage !',
    message: (name) => `Oh non ! Tu n'as pas réussi à survivre 30 secondes. Essaye encore, ${name} !`,
    emoji: '😢'
  }
};

// Message de fin en fonction du résultat
const gameOverData = computed(() => {
  const status = props.result.win ? 'win' : 'lose';
  return {
    ...gameOverMessages[status],
    message: gameOverMessages[status].message(props.character.name.split(' ')[0])
  };
});

// Messages personnalisés pour chaque personnage
const characterMessages = {
  alizee: "Merci pour tout les bons moments passés ensemble, désolé d'avoir dit que la Bretagne et la Normandie c'était pareil...",
  amelie: "Avec Oreo moi je collabore ✅ Délichoc pas d'accord ⛔",
  angelique: "Merci de m'avoir accueilli au sein de Diag2Tec : c'était une super expérience. Vous êtes une super équipe, surtout ne changez pas !",
  djamila: "Désolé pour la blague du lion 😅, je te souhaite plein de bonheur et de réussite dans ta nouvelle aventure !",
  elina: "La meilleure tutrice ! Merci d'avoir été aussi flexible et de m'avoir guidé sur le projet, tiens moi au courant de évolutions de DiagBiosis !",
  hugues: "De toute façon tu n'iras jamais en prison, la prison pour les...",
  julien: "En espérant que tu m'aprennes un jour à flip reset",
  margaux: "N'oublie pas d'acheter la même carafe à Amélie",
  valentin: "Gard et, Gard et, GARDHERAULT !"
};

const characterMessage = computed(() => {
  return characterMessages[props.character.id] || "Quelle performance incroyable !";
});
</script>

<template>
  <div class="game-over-container text-center">
    <div class="result-animation mb-8">
      <div class="text-8xl mb-4">{{ gameOverData.emoji }}</div>
      <h2 class="text-4xl font-bold mb-2">{{ gameOverData.title }}</h2>
      <p class="text-xl mb-6 max-w-2xl mx-auto">{{ gameOverData.message }}</p>
      
      <div v-if="result.win" class="character-message bg-white bg-opacity-10 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
        <p class="text-lg italic">"{{ characterMessage }}"</p>
      </div>
    </div>
    
    <div class="character-showcase mb-8">
      <div class="inline-block relative">
        <img 
          :src="character.image" 
          :alt="character.name" 
          class="w-40 h-40 mx-auto mb-4"
          style="object-fit: contain;"
        />
        <div class="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap mt-2">
          Score: {{ score }}
        </div>
      </div>
      <h3 class="text-2xl font-bold mt-4">{{ character.name }}</h3>
    </div>
    
    <div class="game-stats bg-white bg-opacity-10 p-6 rounded-lg max-w-md mx-auto mb-8 text-left">
      <h3 class="text-xl font-bold mb-4 text-center">Statistiques de la partie</h3>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="opacity-80">Temps de survie :</span>
          <span class="font-medium">{{ Math.floor(result.time) }} secondes</span>
        </div>
        <div class="flex justify-between">
          <span class="opacity-80">Obstacles évités :</span>
          <span class="font-medium">{{ Math.floor(score * 1.5) }}</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center mt-8">
      <button 
        @click="$emit('restart')" 
        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
      >
        Rejouer
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-over-container {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.8s ease-out;
}

.result-animation {
  animation: slideDown 0.8s ease-out;
}

.character-showcase {
  animation: fadeIn 1s ease-out 0.3s both;
}

.game-stats {
  animation: fadeIn 1s ease-out 0.6s both;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.actions {
  animation: fadeIn 1s ease-out 0.9s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
