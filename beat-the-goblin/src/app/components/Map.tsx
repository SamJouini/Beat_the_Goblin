'use client';
import Image from "next/image";
import styles from "./Map.module.css";

const Map = () => {
  return (
    <section className={styles.mapSection}>
      <h2 className={styles.mapTitle}>The adventure map</h2>
      <div className={styles.mapContainer}>
        <Image
          src="/assets/map/map.png"
          alt="game's map"
          width={850}
          height={650}
        />
      </div>
    </section>
  );
};

export default Map;
