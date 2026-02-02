import { useCustomizerStore } from '../../store/customizerStore';
import { ColorPicker } from './ColorPicker';
import { TextLabelEditor } from './TextLabelEditor';
import { ViewControls } from './ViewControls';
import styles from './CustomizerPanel.module.css';

export function CustomizerPanel() {
  const {
    sleeveColor,
    frontColor,
    backColor,
    setSleeveColor,
    setFrontColor,
    setBackColor,
    reset,
  } = useCustomizerStore();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>3D Customizer</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors</h2>

        <ColorPicker
          label="Sleeve Color"
          currentColor={sleeveColor}
          onColorChange={setSleeveColor}
        />

        <ColorPicker
          label="Front Color"
          currentColor={frontColor}
          onColorChange={setFrontColor}
        />

        <ColorPicker
          label="Back Color"
          currentColor={backColor}
          onColorChange={setBackColor}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Text Labels</h2>
        <TextLabelEditor />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Camera Controls</h2>
        <ViewControls />
      </section>

      <div className={styles.resetSection}>
        <button onClick={reset} className={styles.resetButton}>
          Reset All
        </button>
      </div>
    </div>
  );
}
