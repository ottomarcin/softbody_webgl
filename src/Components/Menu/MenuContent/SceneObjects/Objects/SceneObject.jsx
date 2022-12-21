import React from 'react';
import styled from 'styled-components';
import RoundButton from '../../../Common/RoundButton';
import useExperienceStore from '../../../../StateManagement/experienceStore';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Individual child of scene with button to remove it
 */

function SceneObject({ object }) {
  /**
   * Retrieving states and functions from state manager
   * useExperienceStore holds various states of application with functions to change them
   */

  // function to remove children from scene
  const removeObjectsFromScene = useExperienceStore(
    (state) => state.removeObjectsFromScene
  );

  return (
    <li>
      <Wrapper>
        {object.name}
        <RoundButton
          style={{ position: 'absolute', right: '30%' }}
          // style={{ marginLeft: '1em' }}
          bgColor={'red'}
          borderColor={false}
          size={1.5}
          color={'white'}
          onClick={() => removeObjectsFromScene(object)}
        >
          <i className='fa-sharp fa-solid fa-xmark'></i>
        </RoundButton>
      </Wrapper>
    </li>
  );
}

export default SceneObject;
