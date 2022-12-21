import React from 'react';
import styled from 'styled-components';

// inspired by https://moderncss.dev/pure-css-custom-checkbox-style/

const CheckInput = styled.input`
  appearance: none;
  background-color: #fff;
  margin: 0;
  padding: 0;
  color: ${(props) => props.color};
  width: ${(props) => props.size}em;
  height: ${(props) => props.size}em;
  border: 0.1em solid ${(props) => props.color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    width: 70%;
    height: 70%;
    transform: scale(0);
    border-radius: 50%;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${(props) => props.color};
    transform-origin: center;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }
  &:checked::before {
    transform: scale(1);
  }
`;

function CheckBox({ checked, onChange, color = '#2f2f2f', size = 1.2, style }) {
  return (
    <CheckInput
      type={'checkbox'}
      checked={checked}
      onChange={onChange}
      color={color}
      size={size}
      style={{ ...style }}
    />
  );
}

export default CheckBox;
