<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select-character']);

import { getAssetUrl } from '@/utils/assetHelper';
// Liste des personnages avec descriptions mises à jour
const characters = [
  { 
    id: 'alizee', 
    name: 'Alizée', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    description: "La Normande intrépide, championne des montées à vélo et protectrice du camembert. Sa rivalité avec Valentin le Breton est légendaire… sauf quand ils unissent leurs forces, formant l'alliance bretonno-normande ultime contre le reste de l'équipe."
  },
  { 
    id: 'amelie', 
    name: 'Amélie', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    badges: ['vainqueur'],
    description: "Athlète infatigable : course à pied, salle de sport, et des marathons… sur Twitch. A récemment appris le rock (la danse, pas la guitare), et pourrait bientôt lancer sa propre chaîne fitness-gaming."
  },
  { 
    id: 'angelique', 
    name: 'Angélique', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    badges: ['vainqueur'],
    description: "La Cheffe suprême de Diag2Tec, Gardoise et fière de l'être. Peut déclencher une croisade régionale si quelqu'un ose dire que l'Hérault c'est mieux."
  },
  { 
    id: 'djamila', 
    name: 'Djamila', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    description: "La douceur incarnée, aussi timide que gentille. S'apprête à quitter l'équipe pour Lyon, ce qui déclenchera probablement un deuil collectif."
  },
  { 
    id: 'elina', 
    name: 'Elina', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    description: "Bio-informaticienne venue du Cantal, fan de rugby et de bonne humeur contagieuse. Gare à toi si tu critiques sa région : elle pourrait te plaquer comme un pilier en mêlée."
  },
  { 
    id: 'hugues', 
    name: 'Hugues', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    description: "Le papa motard de l'équipe, roi des blagues borderline. Transforme chaque café en stand-up improvisé. Quand il n'est pas là, les pauses déjeuner ressemblent à des retraites silencieuses."
  },
  { 
    id: 'julien', 
    name: 'Julien', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    description: "L'oracle des JRPG et mangas. Ancien joueur pro sur Rocket League. Si un jeu ou un tome existe, il l'a déjà fini avant sa sortie officielle."
  },
  { 
    id: 'margaux', 
    name: 'Margaux', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    badges: ['vainqueur'],
    description: "Stagiaire qualité, convertie officielle à la salle de sport avec Amélie, mais carburant au thé plutôt qu'à la caféine. Amélie rêve d'avoir sa carafe de thé."
  },
  { 
    id: 'valentin', 
    name: 'Valentin', 
    get image() { return new URL(`/src/assets/characters/${this.id}.png`, import.meta.url).href; },
    badges: ['vainqueur'],
    description: "Le Breton encyclopédique, maître du fact-checking en pleine pause déjeuner. Coureur régulier, troll professionnel des Normands… sauf quand il s'allie à Alizée pour former un duo redoutable bretonno-normand."
  },
];

const selectedCharacter = ref(null);
const hoveredCharacter = ref(null);

const selectCharacter = (character) => {
  selectedCharacter.value = character;
  emit('select-character', character);
};

const setHoveredCharacter = (character) => {
  hoveredCharacter.value = character;
};
</script>

<template>
  <div class="character-select h-full flex flex-col">
    <h2 class="text-2xl font-bold text-center mb-8">Choisissez votre personnage</h2>
    
    <div class="relative w-full">
      <div class="flex overflow-x-auto pb-6 hide-scrollbar">
        <div class="flex space-x-8 px-8 py-4">
          <div 
            v-for="character in characters" 
            :key="character.id"
            @click="selectCharacter(character)"
            @mouseenter="setHoveredCharacter(character)"
            @mouseleave="setHoveredCharacter(null)"
            class="character-card flex-shrink-0 w-64 p-4 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm border-2 border-transparent hover:border-blue-400 hover:shadow-[0_0_0_4px_rgba(96,165,250,0.4)] transition-all cursor-pointer transform hover:scale-105 flex flex-col items-center"
            :class="{ 'border-blue-400 scale-105 shadow-[0_0_0_4px_rgba(96,165,250,0.4)]': selectedCharacter?.id === character.id }"
          >
            <div class="w-56 h-64 mx-auto mb-4 overflow-hidden rounded-lg">
              <img 
                :src="character.image" 
                :alt="character.name" 
                class="w-full h-full object-contain"
              />
            </div>
            <h3 class="text-center font-medium">{{ character.name }}</h3>
            <div v-if="character.badges && character.badges.includes('vainqueur')" class="mt-2">
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Vainqueur Gard-Hérault
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="selectedCharacter" class="mt-10 text-center">
        <button 
          @click="selectCharacter(selectedCharacter)"
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-blue-500/50"
        >
          Jouer avec {{ selectedCharacter.name }}
        </button>
      </div>
    </div>
    
    <!-- Zone de description en bas -->
    <div class="mt-auto pt-6">
      <div 
        v-if="hoveredCharacter" 
        class="bg-gray-900 bg-opacity-80 rounded-lg p-6 text-center transition-all duration-500 ease-in-out"
      >
        <p class="text-gray-200 italic text-lg animate-fade-in">{{ hoveredCharacter.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-card {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.character-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

/* Effet d'apparition sur le texte */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>
