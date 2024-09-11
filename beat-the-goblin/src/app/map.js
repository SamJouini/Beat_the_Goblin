import React from 'react';
import Image from 'next/image';

const Tile = ({ type, x, y, size = 1 }) => {
  const tileSize = 64 * size;
  return (
    <div style={{ position: 'absolute', left: x * 64, top: y * 64, width: tileSize, height: tileSize }}>
      <Image 
        src={`/tiles/${type}`}
        width={tileSize}
        height={tileSize}
        alt={type}
        priority
        unoptimized={type.endsWith('.gif')}
      />
    </div>
  );
};

const GameMap = ({ mapData }) => {
  const mapWidth = mapData[0].length * 64;
  const mapHeight = mapData.length * 64;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {mapData.map((row, y) =>
        row.map((tile, x) => {
          if (typeof tile === 'object') {
            return <Tile key={`${x}-${y}`} type={tile.type} x={x} y={y} size={tile.size} />;
          }
          return <Tile key={`${x}-${y}`} type={tile} x={x} y={y} />;
        })
      )}
    </div>
  );
};

export default GameMap;

export const mapData = [

];