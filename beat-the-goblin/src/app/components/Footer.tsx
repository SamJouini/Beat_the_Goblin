import Image from "next/image";
import styles from "./Footer.module.css";

/**
 * Footer Component
 * 
 * This component renders the footer section of the application, displaying
 * a cloud image and copyright information.
 * 
 * Key Features:
 * - Displays a cloud image using Next.js Image component for optimized loading.
 * - Shows copyright text with the current year and author name.
 * 
 * Futur implemetation:
 * - Links to my GitHub (-> other projects).
 * 
 */

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.cloud}>
        <Image
          src="/assets/clouds/leftcloud.png"
          alt="center cloud"
          width={300}
          height={200}
        />
        <div className={styles.footerText}>
          <p>&copy; 2024 by Samantha Jouini</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
