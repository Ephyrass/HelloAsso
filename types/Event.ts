export interface Event {
  id: string | number;
  title: string;
  description: string;
  category: string;
  coords: {
    lat: number;
    lng: number;
  };
}