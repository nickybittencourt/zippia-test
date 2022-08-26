import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useRef } from 'react';


//Custom card component that displays job information
export default function Card({
  logo,
  title,
  company,
  description,
  rating,
}) {
  return (
    <div className={styles.card}>
      <div className={styles['card-left-container']}>
        {logo ? (
          <Image src={logo} width='40px' height='40px' alt='company logo' />
        ) : (
          <div className={styles['generic-company-logo']}>
            {company.charAt(0)}
          </div>
        )}

        <div className={styles['rating-container']}>
          {rating && (
            <>
              <p className={styles.rating}>{rating.toFixed(1)}</p>
              <Image
                src='/static/img/star_full.png'
                width='12px'
                height='12px'
                className={styles['rating-logo']}
                alt='rating star'
              ></Image>
            </>
          )}
        </div>
      </div>
      <div className={styles['card-main-container']}>
        <h3 className={styles['card-job-title']}>{title}</h3>
        <p className={styles['card-company-name']}>{company}</p>
        <p className={styles['card-description']}>{description}</p>
      </div>
    </div>
  );
}
