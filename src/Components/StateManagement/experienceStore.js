import create from 'zustand';
import produce from 'immer';

const useExperienceStore = create((set, get) => ({
  /**
   * Experience - webgl stuff
   */
  // taking reference to whole experience so menu can access its properties
  experience: undefined,
  setExperience: (experience) => {
    set(() => ({
      experience: experience,
    }));
  },

  /**
   * Environment state
   */

  // time
  timePaused: false,
  toggleTimePaused: () =>
    set((state) => ({
      timePaused: !state.timePaused,
    })),

  // gravity
  gravityMultiplier: 1,
  changeGravityMultiplier: (value) => {
    set(() => ({ gravityMultiplier: value }));
  },

  // floor sizes
  floorSizes: { x: 10, z: 10 },
  setFloorSizes: (val, axis) => {
    set(
      produce((state) => {
        state.floorSizes[axis] = val;
      })
    );
  },

  // normals shading
  lambertShading: true,
  toggleLambertShading: () => {
    set((state) => ({ lambertShading: !state.lambertShading }));
  },

  /**
   * New object props
   */
  newObjectPosition: { x: 0, y: 5, z: 0 },
  newObjectSizes: { x: 2, y: 2, z: 2 },
  setNewObjectPosition: (val, axis) => {
    set(
      produce((state) => {
        state.newObjectPosition[axis] = val;
      })
    );
  },
  newJellyDamping: 0.5,
  setNewJellyDamping: (value) => {
    console.log(value);
    set((state) => ({
      newJellyDamping: value,
    }));
  },

  /**
   * Scene state
   */
  sceneChildren: [],
  childrenNumber: 0,
  addObjectToScene: (object) => {
    set((state) => ({
      sceneChildren: [...state.sceneChildren, object],
      childrenNumber: state.childrenNumber + 1,
    }));
  },

  removeObjectsFromScene: (objectsToRemove) => {
    // passed objects are transformed into array so we can iterate over them
    // if it is an array then array deconstruction, if single element then making array with one element
    const inputObjects = Array.isArray(objectsToRemove)
      ? [...objectsToRemove]
      : [objectsToRemove];

    let objectsArray = [...get().sceneChildren];
    inputObjects.forEach((element) => {
      const index = objectsArray.indexOf(element);
      objectsArray.splice(index, 1);
    });
    set(() => ({
      sceneChildren: [...objectsArray],
    }));
  },
}));

export default useExperienceStore;
