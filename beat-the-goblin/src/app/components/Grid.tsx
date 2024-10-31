// GridComponent.tsx
import React from 'react';
import styles from './Map.module.css';

type CellType = 'e' | 't' | 'r' | 'b' | 'l'; 

const gridArray: CellType[][] = [
    /* insert grid here */
]; 

const getImage = (letter: CellType): string | null => {
    switch (letter) {
        case 't': return 'top.gif';
        case 'r': return 'right.gif';
        case 'b': return 'bottom.gif';
        case 'l': return 'left.gif';
        default: return null;
    }
}; 

const GridComponent: React.FC = () => {
    return (
        <div className={styles.water}>
            {gridArray.map((row, rowIndex) => (
                row.map((cell, cellIndex) => {
                    const imageSrc = getImage(cell);
                    return (
                        <div className={styles.cell} key={`${rowIndex}-${cellIndex}`}>
                            {imageSrc && <img src={imageSrc} alt={cell} />}
                        </div>
                    );
                })
            ))}
        </div>
    );
}; export default GridComponent;