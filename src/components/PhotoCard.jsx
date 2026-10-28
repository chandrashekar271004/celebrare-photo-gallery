export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={`https://picsum.photos/id/${photo.id}/600/450`}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => onToggleFavourite(photo)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-md transition ${
            isFavourite
              ? "bg-rose-500 text-white"
              : "bg-white/95 text-slate-700 hover:bg-rose-50 hover:text-rose-500"
          }`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">{isFavourite ? "♥" : "♡"}</span>
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800">{photo.author}</p>
          <p className="mt-0.5 text-xs text-slate-500">Photo #{photo.id}</p>
        </div>
        {isFavourite && (
          <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
            Favourite
          </span>
        )}
      </div>
    </article>
  );
}