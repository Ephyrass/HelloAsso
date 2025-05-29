export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Event {
  id: string | number;
  title: string;
  description: string;
  category: string;
  coords: Coordinates;
}
