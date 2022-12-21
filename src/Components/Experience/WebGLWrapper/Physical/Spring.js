import { vec3 } from 'gl-matrix';

export default class Spring {
  // teraz to będzie tylko wypluwalo sily, jakimi oddzialowuje na kazdy z węzłów
  constructor(nodes, damping) {
    this.nodes = nodes;
    // spring characterictics
    this.stiffness = 1500;
    this.dampingConstant = 15 * damping; // critical damping - 2*sqrt(m*k), k- stiffness, m-mass

    // calculating initial length of spring
    this.initialLength = vec3.distance(
      this.nodes[0].position,
      this.nodes[1].position
    );

    // to prevent creation of new vectors every frame - optimization - initializing vector once ane then reuse them
    this.vectorsToReuse = {
      direction: vec3.create(),
      springForce: vec3.create(),
      velocityDifference: vec3.create(),
    };
  }

  update = () => {
    // calculating current distance between nodes
    const currentDisplacement = vec3.distance(
      this.nodes[1].position,
      this.nodes[0].position
    );
    // calculating force the spring produces (damping included)
    const springForceValue = this.calculateSpringForce(currentDisplacement);

    /**
     * First node
     */
    // specifying direction
    vec3.subtract(
      this.vectorsToReuse.direction,
      this.nodes[1].position,
      this.nodes[0].position
    );
    // normalizing -  vec3.scale is actually multiplying by scalar, so to divide, im multiplying by 1/currentDisplacement
    vec3.scale(
      this.vectorsToReuse.direction,
      this.vectorsToReuse.direction,
      1 / currentDisplacement
    );

    // applying direction to spring force
    vec3.copy(this.vectorsToReuse.springForce, this.vectorsToReuse.direction);
    vec3.scale(
      this.vectorsToReuse.springForce,
      this.vectorsToReuse.springForce,
      springForceValue
    );

    vec3.add(
      this.nodes[0].forces,
      this.nodes[0].forces,
      this.vectorsToReuse.springForce
    );

    /**
     * Second node
     */
    vec3.subtract(
      this.vectorsToReuse.direction,
      this.nodes[0].position,
      this.nodes[1].position
    );
    vec3.scale(
      this.vectorsToReuse.direction,
      this.vectorsToReuse.direction,
      1 / currentDisplacement
    );

    // applying direction to spring force
    vec3.copy(this.vectorsToReuse.springForce, this.vectorsToReuse.direction);
    vec3.scale(
      this.vectorsToReuse.springForce,
      this.vectorsToReuse.springForce,
      springForceValue
    );

    // sum forces already existing in node with current force of the spring
    vec3.add(
      this.nodes[1].forces,
      this.nodes[1].forces,
      this.vectorsToReuse.springForce
    );
  };

  calculateSpringForce = (distanceBetweenNodes) => {
    // normaized direction vector pointing direction of movement
    vec3.subtract(
      this.vectorsToReuse.direction,
      this.nodes[1].position,
      this.nodes[0].position
    );
    // normalizing -  scale is actually multiplying by scalar, so to divide, im multiplying by 1/currentDisplacement
    vec3.scale(
      this.vectorsToReuse.direction,
      this.vectorsToReuse.direction,
      1 / distanceBetweenNodes
    );

    // SPRING FORCE
    // calculating value (without direction) of spring force
    let springForceValue =
      this.stiffness * (distanceBetweenNodes - this.initialLength);

    // DAMPING
    // calculating difference of velocities between nodes
    const velocityDifference = vec3.create();
    vec3.subtract(
      velocityDifference,
      this.nodes[1].velocity,
      this.nodes[0].velocity
    );

    const velocityToDamping = vec3.dot(
      this.vectorsToReuse.direction,
      velocityDifference
    );

    const dampingValue = this.dampingConstant * velocityToDamping;
    return springForceValue + dampingValue;
  };
}
