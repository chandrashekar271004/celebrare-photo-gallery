import { useCallback, useMemo, useReducer, useState, useEffect } from "react";
import useFetchPhotos from "./hooks/useFetchPhotos.js";
import favouritesReducer, {
  initialFavourites,
  STORAGE_KEY,
} from "./reducers/favouritesReducer.js";
import PhotoCard from "./components/PhotoCard.jsx";

export default function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [favourites, dispatch] = useReducer(favouritesReducer, initialFavourites);

  // Save the reducer-managed favourites whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // The app remains usable if browser storage is disabled or full.
    }
  }, [favourites]);

  // useCallback keeps the search handler function stable between renders.
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleToggleFavourite = useCallback((photo) => {
    dispatch({ type: "TOGGLE_FAVOURITE", photo });
  }, []);

  // useMemo recalculates the visible list only when its inputs change.
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesAuthor = photo.author.toLowerCase().includes(query);
      const matchesFavourite = !showFavouritesOnly ||
        favourites.some((favourite) => favourite.id === photo.id);
      return matchesAuthor && matchesFavourite;
    });
  }, [photos, searchTerm, showFavouritesOnly, favourites]);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((photo) => photo.id)),
    [favourites]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <span aria-hidden="true" className="text-2xl">▧</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Photo Gallery</h1>
            <p className="text-sm text-slate-500">A little inspiration, one photo at a time.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">Discover & save</p>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Find a photo that speaks to you.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Browse photographs, search by creator, and keep your favourites close.
          </p>
        </section>

        <section aria-label="Gallery controls" className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-md">
            <span className="sr-only">Search by author name</span>
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">⌕</span>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by author name..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFavouritesOnly(false)}
              aria-pressed={!showFavouritesOnly}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                !showFavouritesOnly ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              All photos
            </button>
            <button
              type="button"
              onClick={() => setShowFavouritesOnly(true)}
              aria-pressed={showFavouritesOnly}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                showFavouritesOnly ? "bg-rose-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <span aria-hidden="true" className="text-base">{showFavouritesOnly ? "♥" : "♡"}</span>
              Favourites ({favourites.length})
            </button>
          </div>
        </section>

        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            {showFavouritesOnly ? "Your favourites" : "Explore photos"}
          </h3>
          {!loading && !error && (
            <p className="text-sm text-slate-500">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? "photo" : "photos"}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div aria-hidden="true" className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="font-semibold text-slate-800">Loading photos...</p>
            <p className="mt-1 text-sm text-slate-500">Fetching photographs from Picsum.</p>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-200 bg-white p-8 text-center">
            <span aria-hidden="true" className="mb-3 text-4xl text-red-500">▧</span>
            <p className="font-semibold text-slate-900">We couldn't load the photos.</p>
            <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
            <p className="mt-2 text-sm text-slate-500">Refresh the page to try again.</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favouriteIds.has(photo.id)}
                onToggleFavourite={handleToggleFavourite}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
              {showFavouritesOnly ? <span aria-hidden="true" className="text-2xl">♡</span> : <span aria-hidden="true" className="text-2xl">⌕</span>}
            </div>
            <p className="font-semibold text-slate-900">
              {showFavouritesOnly
                ? "No favourites yet"
                : "No photos match your search"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {showFavouritesOnly
                ? "Tap the heart on any photo to save it here."
                : "Try another author name or clear your search."}
            </p>
            {(searchTerm || showFavouritesOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setShowFavouritesOnly(false);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <span aria-hidden="true">↻</span> Show all photos
              </button>
            )}
          </div>
        )}

        <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Built with React, Vite and Tailwind CSS · Photos provided by Picsum Photos
        </footer>
      </main>
    </div>
  );
}