// import React from 'react';
import styled from 'styled-components';

const SliderInput = styled.input`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 75%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
  height: 1.5rem;

  ::-webkit-slider-thumb {
    -webkit-appearance: none; //turning off standard style
    //custom styling
    border: 0.2rem solid ${(props) => props.color}; //#bcd4e6;
    width: 1rem;
    height: 1rem;
    margin-top: -0.4rem;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    cursor: ew-resize;
    // box-shadow: 0 0 0.5rem 0.2rem rgba(0, 0, 0, 0.05);
  }
  ::-webkit-slider-runnable-track {
    // width: 100%;
    height: 0.2rem;
    cursor: ew-resize;
    background: ${(props) => props.color}; //#bcd4e6;// 3071a9
  }
  :focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }

  :focus {
    //turning off standard style
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    //custom styling
  }
  :-ms-track {
    width: 100%;
    cursor: pointer;
    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`;
const Label = styled.div`
  font-size: 0.9rem;
`;

function Slider(props) {
  const changeValue = (event) => {
    event.stopPropagation();
    props.onChange(event.target.value);
  };
  return (
    <>
      <Label>{`${props.label} ${props.value}${
        props.unit ? props.unit : ''
      }`}</Label>
      <SliderInput
        type='range'
        value={props.value}
        min={props.minValue}
        max={props.maxValue}
        color={props.color}
        step={props.step}
        onChange={changeValue}
      />
    </>
  );
}

export default Slider;
