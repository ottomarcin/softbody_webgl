import React from 'react';
import styled from 'styled-components';
import SceneObject from './SceneObject';

const Wrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;
/**
 * Rendering list of objects added by user
 */
function SceneObjects({ objects }) {
  return (
    <>
      <h3 style={{ margin: '0', marginTop: '0.5em' }}>List of objects</h3>
      <Wrapper>
        {objects.map((obj, index) => {
          return <SceneObject key={index} object={obj} />;
        })}
      </Wrapper>
    </>
  );
}

export default SceneObjects;
