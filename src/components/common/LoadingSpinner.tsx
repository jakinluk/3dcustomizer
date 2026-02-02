import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Loading 3D model...' }: LoadingSpinnerProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}
