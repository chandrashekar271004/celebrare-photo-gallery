const STORAGE_KEY = "celebrare-photo-gallery-favourites";

function readSavedFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Invalid or unavailable localStorage should not prevent the gallery opening.
    return [];
  }
}

export const initialFavourites = readSavedFavourites();

/**
 * The reducer keeps favourite changes predictable and in one place.
 * State is an array of photo objects so saved favourites can render by themselves.
 */
export default function favouritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const alreadyFavourite = state.some((photo) => photo.id === action.photo.id);

      if (alreadyFavourite) {
        return state.filter((photo) => photo.id !== action.photo.id);
      }

      return [...state, action.photo];
    }

    case "CLEAR_FAVOURITES":
      return [];

    default:
      return state;
  }
}

export { STORAGE_KEY };