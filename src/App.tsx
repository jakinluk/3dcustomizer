import { ThreeCanvas } from './components/ThreeCanvas';
import { CustomizerPanel } from './components/CustomizerPanel';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <CustomizerPanel />
      <div className={styles.mainArea}>
        <ThreeCanvas />
      </div>
    </div>
  );
}

export default App;
