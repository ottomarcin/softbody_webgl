import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CaretButton from '../Common/CaretButton';

const Panel = styled.div`
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1.5em;
  //   background-color: #bdc4a7;
  background-color: #e4ebf5;
  // background-color: #f1f2eb;
  border: solid 2px #2f2f2f;
  color: #2f2f2f;
  width: 100%;
`;
const ChildrenWrapper = styled.div`
  margin-bottom: 0.5em;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function SubPanel({ title, children, toggleFunction = () => null }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    toggleFunction(visible);
  }, [visible]);
  return (
    <Panel>
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontStyle: 'italic',
            margin: 0,
            cursor: 'default',
          }}
        >
          {title}
        </h1>
        <CaretButton
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: '1em',
          }}
          enabled={visible}
          onClick={() => {
            setVisible(!visible);
          }}
        />
      </div>
      {visible && <ChildrenWrapper>{children}</ChildrenWrapper>}
    </Panel>
  );
}

export default SubPanel;
