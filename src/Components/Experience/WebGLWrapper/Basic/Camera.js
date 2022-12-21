import { mat4 } from 'gl-matrix';

class Camera {
  constructor(
    sizes,
    fov = 90,
    position = [0, 0, -2.0],
    target = [0, 0, 0],
    near = 0.1,
    far = 100
  ) {
    // getting reference to sizes of canvas
    this.sizes = sizes;
    // camera's vertical (y) field of view in degrees
    this.fov = fov;
    // camera position in world coordinates
    this.position = position;
    // vector the cam points
    this.target = target;
    //nearest visible plane from camera's perspective
    this.near = near;
    //furthest visible plane from camera's perspective
    this.far = far;
    //up vector
    this.up = [0, 1, 0];

    /**
     * Camera matrices - projecting world space to stuff drawn on screen
     */
    // view matrix - transforms world space to camera (eye) space
    this.viewMatrix = mat4.create(); // starting with identity matrix, update it by calling updateViewMatrix method
    // projection matrix projects scene into screen
    this.projectionMatrix = mat4.create(); // starting with identity matrix, update it by calling updateProjectionMatrix method

    // initializing matrices
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
  updateViewMatrix = () => {
    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
  };

  updateProjectionMatrix = () => {
    mat4.perspective(
      this.projectionMatrix,
      this.fov * (Math.PI / 180),
      this.sizes.width / this.sizes.height,
      this.near,
      this.far
    );
  };
  setPosition = (vector3) => {
    this.position = vector3;
    this.updateViewMatrix();
  };
  resize = () => {
    // resize - wraps updating projection matrix to update aspect ratio after resize
    this.updateProjectionMatrix();
  };
}

export default Camera;
