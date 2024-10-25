import Image from "next/image";
import styles from "./Footer.module.css";

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
