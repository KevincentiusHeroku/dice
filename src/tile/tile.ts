
export enum TileType { EMPTY, GARBAGE, BOMB, LOCK, GLASS }

export interface Tile {
  colorId: number;
  //connectivity: boolean[];
  isGarbage: boolean;
  nonClearing?: boolean;
  type?: TileType;
}
