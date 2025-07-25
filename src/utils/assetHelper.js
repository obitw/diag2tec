// Helper pour charger les assets correctement en développement et en production
export const getAssetUrl = (path) => {
  // En développement, utilisez le chemin relatif
  if (import.meta.env.DEV) {
    return path;
  }
  // En production, utilisez le chemin absolu avec la base
  return new URL(path, import.meta.url).href;
};
