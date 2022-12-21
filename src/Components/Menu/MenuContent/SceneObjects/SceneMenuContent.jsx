import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useExperienceStore from '../../../StateManagement/experienceStore';
import NewObject from './NewObject/NewObject';
import SceneObjects from './Objects/SceneObjects';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.5em;
`;

function SceneMenuContent(props) {
  /**
   * Retrieving states and functions from state manager
   * useExperienceStore holds various states of application with functions to change them
   */

  // getting reference to experience
  const experience = useExperienceStore((state) => state.experience);

  // getting array of scene children
  const sceneChildren = useExperienceStore((state) => state.sceneChildren);

  //updating list of children - after addition or removal sceneChildren changes
  useEffect(() => {
    if (experience) {
      experience.scene.externalChildren = [...sceneChildren];
      experience.scene.mergeChildren();
    }
  }, [sceneChildren]);

  return (
    <Wrapper>
      <NewObject />
      {/* displaying list of object added by user */}
      {sceneChildren.length > 0 && <SceneObjects objects={sceneChildren} />}
    </Wrapper>
  );
}

export default SceneMenuContent;
