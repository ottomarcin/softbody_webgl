import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  width: ${(props) => props.size}em;
  height: ${(props) => props.size}em;
  border-radius: 100px;
  background-color: ${(props) => (props.disabled ? '#aaaaaa' : props.bgColor)};
  // background-color: #2f2f2f;
  border: ${(props) =>
    props.borderColor ? `solid 2px ${props.borderColor}` : 'none'};
  color: ${(props) => props.color};
`;

function RoundButton({
  bgColor,
  borderColor = '#bdc4a7',
  color,
  style,
  onClick,
  disabled = false,
  children,
  size = 3,
}) {
  return (
    <Button
      bgColor={bgColor}
      borderColor={borderColor}
      color={color}
      size={size}
      style={style}
      disabled={disabled}
      onClick={(e) => {
        onClick();
        e.stopPropagation();
      }}
    >
      {children}
    </Button>
  );
}

export default RoundButton;
