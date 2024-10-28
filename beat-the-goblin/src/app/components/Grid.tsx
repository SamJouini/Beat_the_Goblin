// GridComponent.tsx
import React from 'react';
import styles from './Map.module.css';

type CellType = 'e' | 't' | 'r' | 'b' | 'l'; 

const gridArray: CellType[][] = [
    ['l', 't', 'e', 'l', 'e', 'r', 'e','e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 't', 'e', 'e', 'b', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 't', 'e', 'e', 'b', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'r', 'e', 'e', 'l', 't', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'l', 'e', 'r', 't', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'l', 'e', 'r', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'l', 'e', 'r', 'e','e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 't', 'e', 'e', 'b', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 't', 'e', 'e', 'b', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'r', 'e', 'e', 'l', 't', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'l', 'e', 'r', 't', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'l', 'e', 'r', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r'],
    ['l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r','l', 't', 'e', 'e', 'b', 'e', 'r', 'e', 't', 'e', 'l','r']
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