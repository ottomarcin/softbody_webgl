import { vec3 } from 'gl-matrix';

export default class Node {
  constructor(position, index) {
    this.index = index;
    this.forces = vec3.fromValues(0, 0, 0);
    this.velocity = vec3.fromValues(0, 0, 0);
    this.acceleration = vec3.fromValues(0, 0, 0);
    this.position = vec3.clone(position);
    this.correspondingVerticesIndices = [];
  }
}
