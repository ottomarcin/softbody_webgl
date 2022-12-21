import React from 'react';
import RoundButton from '../Common/RoundButton';

function ToggleButton({ toggleState, onClick }) {
  return (
    <RoundButton bgColor={'#2f2f2f'} color={'#e4ebf5'} onClick={onClick}>
      {toggleState ? (
        <i className='fa-solid fa-arrow-right'></i>
      ) : (
        <i className='fa-solid fa-arrow-left'></i>
      )}
    </RoundButton>
  );
}

export default ToggleButton;
