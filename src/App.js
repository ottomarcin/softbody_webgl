import Canvas from './Components/Experience/Canvas';
import Menu from './Components/Menu/Menu';

function App() {
  /**
   * - Canvas component represents all webgl related features
   * - Menu component provide controls over webgl experience
   * - Two above components communicates with each other using state manager powered by Zustand - see StateManagement/experienceStore.js
   */
  return (
    <>
      <Canvas />
      <Menu />
    </>
  );
}

export default App;
