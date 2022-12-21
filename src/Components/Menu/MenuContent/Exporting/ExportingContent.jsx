import React from 'react';
import objExporter from '../../../Experience/Utlis/objExporter';
import useExperienceStore from '../../../StateManagement/experienceStore';
import RoundButton from '../../Common/RoundButton';

function ExportingContent(props) {
  /**
   * Retrieving states and functions from state manager
   * useExperienceStore holds various states of application with functions to change them
   */
  // getting reference to experience
  const experience = useExperienceStore((state) => state.experience);

  return (
    <>
      <h3
        style={{
          margin: 0,
          cursor: 'default',
        }}
      >
        Export scene as *.obj
      </h3>
      <RoundButton
        bgColor={'#2f2f2f'}
        color={'#e4ebf5'}
        // exporting scene on button click
        onClick={() => objExporter(experience.scene)}
      >
        <i className='fa-solid fa-download'></i>
      </RoundButton>
    </>
  );
}

export default ExportingContent;
