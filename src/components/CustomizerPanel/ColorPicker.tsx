import { COLOR_PRESETS } from '../../constants/presets';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  label: string;
  currentColor: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ label, currentColor, onColorChange }: ColorPickerProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.swatches}>
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.hex}
            className={`${styles.swatch} ${
              currentColor === preset.hex ? styles.active : ''
            }`}
            style={{ backgroundColor: preset.hex }}
            onClick={() => onColorChange(preset.hex)}
            title={preset.name}
            aria-label={`Select ${preset.name}`}
          />
        ))}
      </div>
    </div>
  );
}
