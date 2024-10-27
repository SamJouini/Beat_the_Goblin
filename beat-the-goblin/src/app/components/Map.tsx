'use client';
import Image from "next/image";
import styles from "./Map.module.css";

/**
 * Map Component
 * 
 * This component renders the map section of the application,
 * currently displaying a title and an image of the map.
 * 
 * Key Features:
 * - Displays a title for the map section.
 * - Renders an image of the game's map using Next.js Image component.
 * 
 * Futur implementations:
 * - Current idea is to use the map as a planner so the user can manage their tasks up to 6 days ahead.
 * - While the technical implementation details are still fuzzy, the concept is to associate 
 *   various map locations with specific weekdays (e.g., Sundays = beach, Mondays = tower, etc.).
 * - The user would be able to move their avatar (currently the knight) by clicking on the corresponding 
 * location on the map and to manage the associated day's to-do.
 */

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
