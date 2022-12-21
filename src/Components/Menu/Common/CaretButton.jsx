import styled from 'styled-components';
import React from 'react';
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

function CaretButton({ style, enabled, onClick }) {
  return (
    <Button style={style} onClick={onClick}>
      {enabled ? (
        <i className='fa-solid fa-caret-up'></i>
      ) : (
        <i className='fa-solid fa-caret-down'></i>
      )}
    </Button>
  );
}

export default CaretButton;
