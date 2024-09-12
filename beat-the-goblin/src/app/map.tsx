import Image from "next/image";
import styles from "./page.module.css";

// Paths to the tiles
const tileImages = {
    water: '/assets/map/water/Water.png',
    foam: '/assets/map/water/Foam.gif',
    grass: '/assets/map/tiles/SmallGreenTile.png',
    sand: '/assets/map/tiles/SmallSandTile.png',
    bigTree: '/assets/map/tiles/BigTree.png',
};

type TileType = keyof typeof tileImages;

//map layout
const MAP_LAYOUT: TileType[][] = [
  ['grass', 'foam', 'sand', 'grass', 'bigTree'],
  ['foam', 'sand', 'grass', 'water', 'sand'],
  ['grass', 'water', 'sand', 'grass', 'water'],
  ['foam', 'sand', 'grass', 'water', 'sand'],
  ['grass', 'water', 'sand', 'grass', 'water'],
  ['water', 'sand', 'grass', 'water', 'sand'],
  ['grass', 'water', 'sand', 'grass', 'water'],
];

// Function to create the grid 
const GRID_WIDTH = 5;
const GRID_HEIGHT = 7;
const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;
const OVERLAP = 3;

interface GridTile {
  type: TileType;
  x: number;
  y: number;
}

function createGrid(): GridTile[] {
  const grid: GridTile[] = [];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      grid.push({
        type: MAP_LAYOUT[row][col],
        x: col * (TILE_WIDTH - OVERLAP),
        y: row * (TILE_HEIGHT - OVERLAP)
      });
    }
  }

  return grid;
}

const TheMap = () => {
    const grid = createGrid();
    const mapWidth = GRID_WIDTH * TILE_WIDTH - (GRID_WIDTH - 1) * OVERLAP;
    const mapHeight = GRID_HEIGHT * TILE_HEIGHT - (GRID_HEIGHT - 1) * OVERLAP;
    
    return (
        <div className={styles.TheMap} style={{ width: mapWidth, height: mapHeight, position: 'relative' }}>
            {grid.map((tile, index) => {
                const imagePath = tileImages[tile.type];
                return (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            left: `${tile.x}px`,
                            top: `${tile.y}px`,
                            width: `${TILE_WIDTH}px`,
                            height: `${TILE_HEIGHT}px`,
                        }}
                    >
                        <Image
                            src={imagePath}
                            alt={`Tile ${tile.type}`}
                            width={TILE_WIDTH}
                            height={TILE_HEIGHT}
                            priority
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TheMap;
