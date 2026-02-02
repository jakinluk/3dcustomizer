import styles from './WebGLError.module.css';

interface WebGLErrorProps {
  message?: string;
}

export function WebGLError({ message }: WebGLErrorProps = {}) {
  const isWebGLError = !message;

  return (
    <div className={styles.container}>
      <div className={styles.errorBox}>
        <h2 className={styles.title}>
          {isWebGLError ? 'WebGL Not Supported' : 'Error'}
        </h2>
        <p className={styles.message}>
          {message || "Your browser doesn't support WebGL, which is required for 3D rendering."}
        </p>
        {isWebGLError && (
          <p className={styles.suggestion}>
            Please try using a modern browser like Chrome, Firefox, or Safari.
          </p>
        )}
      </div>
    </div>
  );
}
