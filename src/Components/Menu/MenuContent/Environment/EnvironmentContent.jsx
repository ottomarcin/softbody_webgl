import React, { useEffect } from 'react';
import useExperienceStore from '../../../StateManagement/experienceStore';
import CheckBox from '../../Common/CheckBox';
import RoundButton from '../../Common/RoundButton';
import Slider from '../../Common/Slider';

/**
 * Environment tab
 * takes care of all stuff related with environment of the scene
 */
function EnvironmentContent(props) {
  /**
   * Retrieving states and functions from state manager
   * useExperienceStore holds various states of application with functions to change them
   */

  // getting access to experience
  const experience = useExperienceStore((state) => state.experience);

  // gravity
  const gravityMultiplier = useExperienceStore(
    (state) => state.gravityMultiplier
  );
  const changeGravityMultiplier = useExperienceStore(
    (state) => state.changeGravityMultiplier
  );

  // pausing time
  const timePaused = useExperienceStore((state) => state.timePaused);
  const toggleTimePaused = useExperienceStore(
    (state) => state.toggleTimePaused
  );

  // floor sizes
  const floorSizes = useExperienceStore((state) => state.floorSizes);
  const setFloorSizes = useExperienceStore((state) => state.setFloorSizes);

  // scene children - objects rendered in scene
  const sceneChildren = useExperienceStore((state) => state.sceneChildren);
  const removeObjectsFromScene = useExperienceStore(
    (state) => state.removeObjectsFromScene
  );

  // toggle scene shading technique
  const lambertShading = useExperienceStore((state) => state.lambertShading);
  const toggleLambertShading = useExperienceStore(
    (state) => state.toggleLambertShading
  );

  /**
   * Setting properties of experience when states are changed
   */

  // updating gravity value
  useEffect(() => {
    if (experience) {
      experience.gravity = -9.81 * gravityMultiplier;
    }
  }, [gravityMultiplier]);

  // updating scale of floor
  useEffect(() => {
    if (experience) {
      // changing scale of floor
      experience.floor.setScale(floorSizes.x, 1, floorSizes.z);
      // searching for boxes outside new floor sizes
      const objectsOutOfBounds = sceneChildren.filter((child) =>
        getOutsideObjects(child, floorSizes)
      );
      // removing boxes out of bounds of updated floor sizes
      if (objectsOutOfBounds.length) {
        removeObjectsFromScene(objectsOutOfBounds);
      }
    }
  }, [floorSizes]);

  // changing shading method on click
  useEffect(() => {
    if (experience) {
      const chosenShading = lambertShading
        ? 'lambertShading'
        : 'normalsShading';
      experience.renderer.setProgram(chosenShading);
      // console.log(experience.renderer.program);
    }
  }, [lambertShading]);

  // pausing time
  useEffect(() => {
    if (experience) {
      experience.time.paused = timePaused;
    }
  }, [timePaused]);

  return (
    <>
      <Slider
        label={'Gravity:'}
        unit={'g'}
        onChange={changeGravityMultiplier}
        value={gravityMultiplier}
        minValue={0.1}
        maxValue={2}
        step={0.1}
        color={'#2f2f2f'}
      />
      <Slider
        label={'World width:'}
        onChange={(e) => {
          console.log(experience.helperBox.getBoundingBox());
          return setFloorSizes(e, 'x');
        }}
        value={floorSizes.x}
        minValue={10}
        maxValue={20}
        step={1}
        color={'#2f2f2f'}
      />
      <Slider
        label={'World depth:'}
        onChange={(e) => setFloorSizes(e, 'z')}
        value={floorSizes.z}
        minValue={10}
        maxValue={20}
        step={1}
        color={'#2f2f2f'}
      />
      <label
        style={{
          userSelect: 'none',
          margin: '0.5em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Light shading
        <CheckBox
          size={1.5}
          checked={lambertShading}
          onChange={toggleLambertShading}
          style={{ marginLeft: '0.5em' }}
        />
      </label>
      <RoundButton
        bgColor={'#2f2f2f'}
        color={'#e4ebf5'}
        onClick={() => toggleTimePaused()}
      >
        {timePaused ? (
          <i className='fa-solid fa-play'></i>
        ) : (
          <i className='fa-solid fa-pause'></i>
        )}
      </RoundButton>
    </>
  );
}

// to jest do naprawy!!!
const getOutsideObjects = (child, floorSizes) => {
  const translatedCoordinates = {
    x: child.getPosition().x + floorSizes.x / 2,
    z: child.getPosition().z + floorSizes.z / 2,
  };
  const boundingBox = child.getBoundingBox();
  console.log(child.name);
  console.log(boundingBox);
  if (
    boundingBox[1].x + floorSizes.x / 2 > floorSizes.x ||
    boundingBox[0].x + floorSizes.x / 2 < 0 ||
    boundingBox[1].z + floorSizes.z / 2 > floorSizes.z ||
    boundingBox[0].z + floorSizes.z / 2 < 0
  ) {
    return child;
  }
};

export default EnvironmentContent;
