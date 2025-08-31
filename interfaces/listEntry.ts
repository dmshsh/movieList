export interface ListEntry {
  id: number;
  movieId: number;
  list: 'watchlist' | 'favorites' | 'watched';
  rating?: number;
}