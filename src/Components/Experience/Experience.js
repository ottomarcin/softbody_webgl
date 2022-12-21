import Renderer from './WebGLWrapper/Basic/Renderer';
import Sizes from './Utlis/Sizes';
import Camera from './WebGLWrapper/Basic/Camera';
import TimePausable from './Utlis/TimePausable';
import Box from './WebGLWrapper/Basic/Box';
import Plane from './WebGLWrapper/Basic/Plane';
import Scene from './WebGLWrapper/Basic/Scene';

/**
 * Experience component
 * root of all webgl features
 */
class Experience {
  constructor(canvas) {
    /**
     * Defining properties
     */
    // getting access to canvas, which displays the webgl
    this.canvas = canvas;
    // sizes, also triggers event when change of sizes occurs
    this.sizes = new Sizes();
    // setting sizes of canvas
    this.canvas.width = this.sizes.width * this.sizes.pixelRatio;
    this.canvas.height = this.sizes.height * this.sizes.pixelRatio;
    // access to time
    // making it pausable so user can pause the animation depending on this.time.delta
    this.time = new TimePausable();
    // gravity - this value can by changed by user through Menu->EnvironmentContent
    this.gravity = -9.81;

    /**
     * Preparing the scene
     */

    // scene, keeps array of objects
    this.scene = new Scene();

    // perspective camera
    this.camera = new Camera(this.sizes, 60);
    this.camera.setPosition([-5, 10, 10]);

    // setting up renderer
    this.renderer = new Renderer(this.canvas, this.sizes);

    // gray box shown in scene - helps with positioning new jelly box
    // a bit bigger than added by user (2x2x2) to prevent z fighting
    this.helperBox = new Box(
      2.001,
      2.001,
      2.001,
      1,
      1,
      1,
      [0.847, 0.855, 0.827],
      [0, 5, 0],
      'Helper'
    );

    // floor
    this.floor = new Plane(1, 1, 1, 1, 'Floor', [0.184, 0.184, 0.184]);
    this.floor.setScale(10, 1, 10);
    this.floor.setPosition(0, -0.01, 0); // prevent z fighting

    //adding objects to scene
    this.scene.add(this.helperBox);
    this.scene.add(this.floor);
    // scene children are divided into 2 groups - predefinedChildren and externalChildren
    // - predefinedChildren - are objects defined here
    // - externalChildren - are objects added by the user via GUI,
    // this structure makes possible displaying list of object added by user in the menu
    // but after any addition or removal of children, both arrays must be merged into one, which is rendered
    this.scene.mergeChildren();

    // animation loop executed in animate method
    this.time.on('tick', this.animate);

    // calling resize method when change of sizes occurs,
    this.sizes.on('resize', this.resize);
  }

  animate = () => {
    // updating every jelly in the scene
    this.scene.children.forEach((child) => {
      if (child.update) {
        child.update(this.time.pausableDelta, this.gravity);
      }
    });

    // drawing scene into the canvas
    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    // setting sizes of canvas
    this.canvas.width = this.sizes.width * this.sizes.pixelRatio;
    this.canvas.height = this.sizes.height * this.sizes.pixelRatio;

    // gl viewport sizes update
    this.renderer.resize();

    // updating camera projection matrix - aspect ratio
    this.camera.resize();
  };
}

export default Experience;
