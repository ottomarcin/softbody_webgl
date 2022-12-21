import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import useExperienceStore from '../StateManagement/experienceStore';
import Experience from './Experience';

const WebglCanvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  // background-color: #ebcfb2;
  // background: radial-gradient(#e7e5df, #dedee0);
  background: radial-gradient(#ffffff, #e4ebf5);
`;

function Canvas(props) {
  // getting reference of canvas to pass to webgl
  const canvasRef = useRef();
  // setExperience - giving reference to experience, so other component (menu etc.) can change its properties
  const setExperience = useExperienceStore((state) => state.setExperience);
  // waiting for canvas to initialize, when its ready initializing experience
  useEffect(() => {
    if (canvasRef.current) {
      setExperience(new Experience(canvasRef.current));
    }
  }, [canvasRef]);

  return (
    <>
      <WebglCanvas ref={canvasRef} />
    </>
  );
}

export default Canvas;
