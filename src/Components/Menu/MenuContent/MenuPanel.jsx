import React, { useEffect } from 'react';
import styled from 'styled-components';
import SubPanel from './SubPanel';
import SceneMenuContent from './SceneObjects/SceneMenuContent';
import EnvironmentContent from './Environment/EnvironmentContent';
import ExportingContent from './Exporting/ExportingContent';
import useExperienceStore from '../../StateManagement/experienceStore';

const Panel = styled.div`
  margin-top: 1em;
  padding: 1em;
  right: 0;
  width: 300px;
  height: 400px;
  border-radius: 2em;
  background-color: #2f2f2f;
  border: solid 2px #bdc4a7;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;

  &::before {
    transform: right(-100px);
    transition: 120ms transform ease-in-out;
    transform-origin: center;
  }
`;

function MenuPanel(props) {
  /**
   * Menu content is divided into three tabs:
   * - environment
   * - scene
   * - exporter
   */

  // when scene tab is closed, then visibility of helper box is being disabled
  const experience = useExperienceStore((state) => state.experience);
  const setHelperBoxVisibility = (visibility) => {
    if (experience) {
      experience.helperBox.visible = visibility;
    }
  };

  return (
    <Panel>
      <SubPanel title={'Environment'}>
        <EnvironmentContent />
      </SubPanel>
      <SubPanel title={'Scene'} toggleFunction={setHelperBoxVisibility}>
        <SceneMenuContent />
      </SubPanel>
      <SubPanel title={'Exporter'}>
        <ExportingContent />
      </SubPanel>
    </Panel>
  );
}

export default MenuPanel;
