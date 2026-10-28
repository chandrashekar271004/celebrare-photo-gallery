# Celebrare Photo Gallery

A responsive photo gallery built with React, Vite, and Tailwind CSS as part of the Celebrare Frontend React Internship pre-screening assignment.

## Features

- Fetches 30 photos from the [Picsum Photos API](https://picsum.photos/v2/list?limit=30).
- Displays a loading spinner while photos are being fetched.
- Handles API failures with an error message.
- Responsive photo grid:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 4 columns
- Displays each photo with its author name and a heart button.
- Filters photos by author name in real time without additional API requests.
- Adds and removes favourites using React's `useReducer`.
- Persists favourites across page refreshes using `localStorage`.
- Uses a custom `useFetchPhotos` hook for data fetching.
- Uses `useCallback` for event handlers and `useMemo` for filtering and derived data.

## Tech Stack

- React
- Vite
- Tailwind CSS
- JavaScript (ES Modules)
- Picsum Photos API
- React Hooks: `useState`, `useEffect`, `useReducer`, `useCallback`, and `useMemo`
- Browser `localStorage`

## Prerequisites

- Node.js 20 or newer recommended
- npm
- An internet connection to fetch photos from Picsum Photos

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/chandrashekar271004/celebrare-photo-gallery.git
```

### 2. Open the project directory

```bash
cd celebrare-photo-gallery
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

`http://localhost:5173`

### 5. Create a production build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
celebrare-photo-gallery/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   └── PhotoCard.jsx
    ├── hooks/
    │   └── useFetchPhotos.js
    └── reducers/
        └── favouritesReducer.js
```

## Implementation Details

### 1. Fetching Photos

**File:** `src/hooks/useFetchPhotos.js`

The custom `useFetchPhotos` hook fetches photos from the Picsum Photos API when the component mounts.

It returns three values:

- `photos`: the fetched photo data.
- `loading`: indicates whether the request is in progress.
- `error`: contains an error message if the request fails.

The hook checks the HTTP response and handles request failures. It also uses `AbortController` to cancel an outstanding request when the component unmounts.

### 2. Responsive Gallery

**Files:** `src/App.jsx` and `src/components/PhotoCard.jsx`

The gallery renders each photo using a reusable `PhotoCard` component.

Tailwind CSS responsive grid classes adapt the layout to different screen sizes:

- `grid-cols-1` for the default mobile layout.
- `sm:grid-cols-2` for tablet-sized screens.
- `lg:grid-cols-4` for desktop-sized screens.

### 3. Author Search

**File:** `src/App.jsx`

The search input filters the already-fetched photos by author name as the user types.

Search is case-insensitive and does not trigger another API request.

The `handleSearchChange` function uses `useCallback`, and `useMemo` calculates the filtered photo list based on the current search text, photo data, favourite filter, and favourites.

### 4. Favourites with useReducer

**Files:** `src/reducers/favouritesReducer.js` and `src/App.jsx`

The favourites reducer manages the list of saved photos.

It supports the following actions:

- `TOGGLE_FAVOURITE`: adds a photo if it is not already a favourite, or removes it if it is already saved.
- `CLEAR_FAVOURITES`: returns an empty favourites list.

The reducer returns updated arrays instead of mutating the existing state.

The initial favourites are loaded from `localStorage`, and an effect saves changes back to storage. This allows favourites to persist across page refreshes in the same browser.

### 5. React Performance Hooks

**File:** `src/App.jsx`

- `useCallback` keeps event handler function references stable between renders.
- `useMemo` caches the filtered photo list until one of its dependencies changes.
- `useReducer` manages favourite state through explicit actions.

The gallery contains only 30 photos, so the performance difference from memoization may be small. These hooks demonstrate the requested React patterns.

## API Reference

**Endpoint:**

`https://picsum.photos/v2/list?limit=30`

The API provides photo metadata, including the photo ID and author. The app uses the photo ID to request the corresponding image.

An active internet connection is required to load remote photo data and images.

## Assignment Scope

This project focuses on the requirements specified in the Celebrare internship assignment: API fetching, loading and error states, a responsive photo grid, author search, persistent favourites, a custom hook, and the requested React hooks.

No component UI library is used.

## Author

Developed as a submission for the Celebrare Frontend React Internship pre-screening assignment.
