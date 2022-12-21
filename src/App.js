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
      <a
        target='_blank'
        // style={{
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'center',
        //   position: 'absolute',
        //   // bottom: 0,
        //   right: 0,
        //   margin: '1em',
        //   zIndex: 10,
        //   color: 'black',
        // }}
        href='https://github.com/ottomarcin/softbody_webgl'
      >
        Check code on Github
      </a>
    </>
  );
}

export default App;
