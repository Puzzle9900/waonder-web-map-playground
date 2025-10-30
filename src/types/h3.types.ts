export interface CursorPosition {
  lat: number;
  lng: number;
}

export interface H3CellData {
  h3Index: string;
  resolution: number;
  boundary: [number, number][];
  cursorPosition: CursorPosition;
}
