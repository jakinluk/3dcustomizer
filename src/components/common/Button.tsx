import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  active?: boolean;
}

export function Button({
  variant = 'primary',
  active = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  const activeClass = active ? styles.active : '';

  return (
    <button
      className={`${styles.button} ${variantClass} ${activeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
