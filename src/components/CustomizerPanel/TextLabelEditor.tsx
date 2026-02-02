import { useState } from 'react';
import { useCustomizerStore } from '../../store/customizerStore';
import styles from './TextLabelEditor.module.css';

export function TextLabelEditor() {
  const { textLabels, addTextLabel, removeTextLabel } = useCustomizerStore();
  const [text, setText] = useState('');
  const [position, setPosition] = useState<'front' | 'back'>('front');

  const handleAdd = () => {
    if (text.trim() && textLabels.length < 5) {
      addTextLabel({
        text: text.trim(),
        position,
        fontSize: 48,
        color: '#000000',
        x: 0.5,
        y: 0.5,
      });
      setText('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          className={styles.input}
          maxLength={20}
        />
      </div>

      <div className={styles.positionToggle}>
        <button
          className={`${styles.toggleButton} ${
            position === 'front' ? styles.active : ''
          }`}
          onClick={() => setPosition('front')}
        >
          Front
        </button>
        <button
          className={`${styles.toggleButton} ${
            position === 'back' ? styles.active : ''
          }`}
          onClick={() => setPosition('back')}
        >
          Back
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={!text.trim() || textLabels.length >= 5}
        className={styles.addButton}
      >
        Add Label
      </button>

      {textLabels.length > 0 && (
        <div className={styles.labelList}>
          <h3 className={styles.listTitle}>Labels ({textLabels.length}/5)</h3>
          {textLabels.map((label) => (
            <div key={label.id} className={styles.labelItem}>
              <span className={styles.labelText}>
                {label.text} <em>({label.position})</em>
              </span>
              <button
                onClick={() => removeTextLabel(label.id)}
                className={styles.removeButton}
                aria-label="Remove label"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
