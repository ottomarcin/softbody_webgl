import React, { useState, useEffect } from 'react';
import JellyCube from '../../../../Experience/WebGLWrapper/Physical/JellyCube';
import useExperienceStore from '../../../../StateManagement/experienceStore';
import RoundButton from '../../../Common/RoundButton';
import Slider from '../../../Common/Slider';

function NewObject(props) {
  const [enabled, setEnabled] = useState(true);

  const jellyColors = [
    [0.02, 0.169, 0.298],
    [0.039, 0.827, 0.078],
    [0.012, 0.973, 0.329],
    [0.055, 0.224, 0.212],
    [0.051, 0.471, 0.533],
  ];

  const floorSizes = useExperienceStore((state) => state.floorSizes);
  const newObjectSizes = useExperienceStore((state) => state.newObjectSizes);
  const setNewObjectPosition = useExperienceStore(
    (state) => state.setNewObjectPosition
  );
  const newObjectPosition = useExperienceStore(
    (state) => state.newObjectPosition
  );

  const addObjectToScene = useExperienceStore(
    (state) => state.addObjectToScene
  );

  const childrenNumber = useExperienceStore((state) => state.childrenNumber);
  const experience = useExperienceStore((state) => state.experience);
  const newJellyDamping = useExperienceStore((state) => state.newJellyDamping);
  const setNewJellyDamping = useExperienceStore(
    (state) => state.setNewJellyDamping
  );

  const addNewJellyCube = (newObjectPosition) => {
    const jelly = new JellyCube(
      2,
      7,
      `Jelly${childrenNumber}`,
      [0.643, 0.761, 0.647],
      newObjectPosition
    );
    addObjectToScene(jelly);
    console.log(experience.scene);
  };

  useEffect(() => {
    const translatedCoordinates = {
      x: newObjectPosition.x + floorSizes.x / 2,
      z: newObjectPosition.z + floorSizes.z / 2,
    };
    if (
      translatedCoordinates.x + newObjectSizes.x / 2 > floorSizes.x ||
      translatedCoordinates.x - newObjectSizes.x / 2 < 0 ||
      translatedCoordinates.z + newObjectSizes.z / 2 > floorSizes.z ||
      translatedCoordinates.z - newObjectSizes.z / 2 < 0
    ) {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  }, [floorSizes, newObjectPosition]);

  useEffect(() => {
    if (experience) {
      const { x, y, z } = newObjectPosition;
      experience.helperBox.setPosition(x, y, z);
    }
  }, [newObjectPosition]);

  return (
    <>
      <h3 style={{ margin: 0 }}>Add new object</h3>
      <Slider
        label={'Position X:'}
        onChange={(e) => {
          //   console.log(typeof e);
          setNewObjectPosition(Number(e), 'x');
        }}
        value={newObjectPosition.x}
        minValue={-(floorSizes.x / 2 - newObjectSizes.x / 2)}
        maxValue={floorSizes.x / 2 - newObjectSizes.x / 2}
        step={0.1}
        color={'#2f2f2f'}
      />
      <Slider
        label={'Position Y:'}
        onChange={(e) => setNewObjectPosition(Number(e), 'y')}
        value={newObjectPosition.y}
        minValue={newObjectSizes.y / 2}
        maxValue={10}
        step={0.1}
        color={'#2f2f2f'}
      />
      <Slider
        label={'Position Z:'}
        onChange={(e) => setNewObjectPosition(Number(e), 'z')}
        value={newObjectPosition.z}
        minValue={-(floorSizes.z / 2 - newObjectSizes.z / 2)}
        maxValue={floorSizes.z / 2 - newObjectSizes.z / 2}
        step={0.1}
        color={'#2f2f2f'}
      />
      <Slider
        label={'Damping:'}
        onChange={(e) => setNewJellyDamping(Number(e))}
        // onChange={(e) => console.log(Number(e))}
        value={newJellyDamping}
        minValue={0}
        maxValue={1}
        step={0.01}
        color={'#2f2f2f'}
      />
      <RoundButton
        // bgColor={'#63C756'}
        bgColor={'#74c277'}
        borderColor={false}
        color={'white'}
        disabled={!enabled}
        size={'2'}
        // onClick={() => addBoxToScene()}
        // onClick={() => setAddObjectState()} // ostatenie
        onClick={() => addNewJellyCube(newObjectPosition)}
      >
        <i className='fa-solid fa-plus'></i>
      </RoundButton>
      {!enabled && (
        <p style={{ fontSize: '0.75em', color: 'red' }}>
          New object's position exceeds world size
        </p>
      )}
    </>
  );
}

export default NewObject;
