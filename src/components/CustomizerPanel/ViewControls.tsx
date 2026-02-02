import { useCustomizerStore } from '../../store/customizerStore';
import styles from './ViewControls.module.css';

export function ViewControls() {
  const { cameraPreset, zoomLevel, setCameraPreset, setZoomLevel } = useCustomizerStore();

  const presets = [
    { id: 'front', label: 'Front' },
    { id: 'back', label: 'Back' },
    { id: 'left', label: 'Left' },
    { id: 'right', label: 'Right' },
  ] as const;

  return (
    <div className={styles.container}>
      <div className={styles.presetButtons}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={`${styles.presetButton} ${
              cameraPreset === preset.id ? styles.active : ''
            }`}
            onClick={() => setCameraPreset(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className={styles.zoomControl}>
        <label className={styles.label}>
          Zoom: {Math.round(zoomLevel * 100)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>
    </div>
  );
}
