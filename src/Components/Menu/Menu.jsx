import React, { useEffect, useState } from 'react';
import MenuPanel from './MenuContent/MenuPanel';
import ToggleButton from './MenuContent/ToggleButton';
import styled from 'styled-components';
import useExperienceStore from '../StateManagement/experienceStore';

const MenuSpace = styled.div`
  margin: 2em;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 5;
  transition: 0.3s;
`;

function Menu(props) {
  // state of menu content visibility visibility
  const [visibility, setVisibility] = useState(true);
  const toggleVisibility = () => setVisibility(!visibility);
  // visibility of new box position helper changes according to menu visibility
  const experience = useExperienceStore((state) => state.experience);
  useEffect(() => {
    if (experience) {
      console.log(experience.helperBox);
      experience.helperBox.visible = visibility;
    }
  }, [visibility]);

  return (
    <MenuSpace>
      <ToggleButton toggleState={visibility} onClick={toggleVisibility} />
      {visibility && <MenuPanel />}
    </MenuSpace>
  );
}

export default Menu;
