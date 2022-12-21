import { mat4, vec3 } from 'gl-matrix';
import { LineCurve3 } from 'three';
// import * as THREE from 'three';
import Box from '../Basic/Box';
import Node from './Node';
import Spring from './Spring';

// pamietac zeby wrzucic do update'a obecna wartosc grawitacji!

export default class JellyCube extends Box {
  constructor(
    boxSize,
    segmentsNumber,
    name,
    color,
    initialPosition,
    damping = 0.5
  ) {
    super(
      boxSize,
      boxSize,
      boxSize,
      segmentsNumber,
      segmentsNumber,
      segmentsNumber,
      color,
      [0, 0, 0],
      name
    );
    /**
     * Defining variables
     */
    this.boxSize = boxSize; //length of box side
    this.pointsPerAxis = segmentsNumber + 1; //number of points in each direction
    this.nodes = []; // nodes - objects on which whole calculations will be performed
    this.connections = []; // list of nodes connected by spring
    this.springs = []; // springs connecting nodes
    this.damping = damping; // damping of every spring
    this.mass = 500 / this.pointsPerAxis ** 3; // mass of every individual point
    this.timeMultiplier = 0.0005;

    // setting up vectors to reuse - preventing creation of new set of vectors every frame
    this.motionVariables = {
      acceleration: vec3.create(),
      velocity: vec3.create(),
      translation: vec3.create(),
    };

    /**
     * Generate points
     */
    this.generatePoints();

    /**
     * Establishing connections between nodes
     */
    const structuralConnections = this.generateStructuralConnections();
    this.connections.push(...structuralConnections);
    const shearConnections = this.generateShearConnections();
    this.connections.push(...shearConnections);
    const bendConnections = this.generateBendConnections();
    this.connections.push(...bendConnections);

    // initializing springs
    this.connections.forEach((connection) => {
      const spring = new Spring(
        [this.nodes[connection[0]], this.nodes[connection[1]]],
        this.damping
      );
      this.springs.push(spring);
    });
    /**
     * Transforming vertices - here, because doing it in the beggining could mess up with creating springs
     */
    this.initialPosition = vec3.fromValues(
      initialPosition.x,
      initialPosition.y - this.boxSize / 2,
      initialPosition.z
    );
    this.transformVertices();
  }

  generatePoints = () => {
    const offset = this.boxSize / (this.pointsPerAxis - 1);
    // generating points to form structure
    for (let i = 0; i < this.pointsPerAxis; i++) {
      for (let j = 0; j < this.pointsPerAxis; j++) {
        for (let k = 0; k < this.pointsPerAxis; k++) {
          const point = vec3.fromValues(
            i * offset - this.boxSize / 2,
            j * offset,
            k * offset - this.boxSize / 2
          );
          let node = new Node(point, this.nodes.length);

          const verticesNumber = this.attributes.vertices.data.length / 3;
          for (let index = 0; index < verticesNumber; index++) {
            const x = this.attributes.vertices.data[index * 3 + 0];
            const y =
              this.attributes.vertices.data[index * 3 + 1] + this.boxSize / 2;
            const z = this.attributes.vertices.data[index * 3 + 2];

            if (
              Math.floor(node.position[0] * 100) == Math.floor(x * 100) &&
              Math.floor(node.position[1] * 100) == Math.floor(y * 100) &&
              Math.floor(node.position[2] * 100) == Math.floor(z * 100)
            ) {
              node.correspondingVerticesIndices.push(index);
            }
          }

          this.nodes.push(node);
        }
      }
    }
  };

  generateStructuralConnections = () => {
    const offset = this.boxSize / (this.pointsPerAxis - 1);
    // structural bounds are between maximum 6 neighbours
    const neighboursArray = [
      vec3.fromValues(0, -offset, 0),
      vec3.fromValues(0, offset, 0),
      vec3.fromValues(-offset, 0, 0),
      vec3.fromValues(offset, 0, 0),
      vec3.fromValues(0, 0, -offset),
      vec3.fromValues(0, 0, offset),
    ];

    return this.generateConnections(neighboursArray);
  };

  generateBendConnections = () => {
    const offset = this.boxSize / (this.pointsPerAxis - 1);
    // bend bounds are also between maximum 6 neighbours, but every second node counts
    const neighboursArray = [
      vec3.fromValues(0, -2 * offset, 0),
      vec3.fromValues(0, 2 * offset, 0),
      vec3.fromValues(-2 * offset, 0, 0),
      vec3.fromValues(2 * offset, 0, 0),
      vec3.fromValues(0, 0, -2 * offset),
      vec3.fromValues(0, 0, 2 * offset),
    ];

    return this.generateConnections(neighboursArray);
  };

  generateShearConnections = () => {
    const offset = this.boxSize / (this.pointsPerAxis - 1);
    const neighboursArray = [
      // XY axis
      vec3.fromValues(offset, offset, 0),
      vec3.fromValues(offset, -offset, 0),
      vec3.fromValues(-offset, offset, 0),
      vec3.fromValues(-offset, -offset, 0),
      // XZ axis
      vec3.fromValues(offset, 0, offset),
      vec3.fromValues(offset, 0, -offset),
      vec3.fromValues(-offset, 0, offset),
      vec3.fromValues(-offset, 0, -offset),
      // YZ axis
      vec3.fromValues(0, offset, offset),
      vec3.fromValues(0, -offset, offset),
      vec3.fromValues(0, offset, -offset),
      vec3.fromValues(0, -offset, -offset),
      // cross connections
      vec3.fromValues(-offset, offset, offset),
      vec3.fromValues(-offset, offset, -offset),
      vec3.fromValues(offset, offset, offset),
      vec3.fromValues(offset, offset, -offset),
      vec3.fromValues(-offset, -offset, offset),
      vec3.fromValues(-offset, -offset, -offset),
      vec3.fromValues(offset, -offset, offset),
      vec3.fromValues(offset, -offset, -offset),
    ];

    return this.generateConnections(neighboursArray);
  };

  generateConnections = (neighbours) => {
    let connections = [];
    const vector3 = vec3.create(); // empty vector to reuse

    for (let index = 0; index < this.nodes.length; index++) {
      // szukam sześciu punktów
      neighbours.forEach((offset) => {
        vec3.add(vector3, this.nodes[index].position, offset);
        // checking if current point lays inside the box
        if (
          vector3[0] <= this.boxSize / 2 &&
          vector3[0] >= -this.boxSize / 2 &&
          vector3[1] <= this.boxSize &&
          vector3[1] >= 0 &&
          vector3[2] <= this.boxSize / 2 &&
          vector3[2] >= -this.boxSize / 2
        ) {
          // searching for index number of this point

          // method without rounding position didnt work in some scenarios
          let neighbour = undefined;
          // iterate through points array to find index of neighbour
          // in some scenarios numerical precision (disprecision?) led to not finding point, so rounding was needed
          for (let idx = 0; idx < this.nodes.length; idx++) {
            if (
              Math.floor(this.nodes[idx].position[0] * 1000) / 1000 ==
                Math.floor(vector3[0] * 1000) / 1000 &&
              Math.floor(this.nodes[idx].position[1] * 1000) / 1000 ==
                Math.floor(vector3[1] * 1000) / 1000 &&
              Math.floor(this.nodes[idx].position[2] * 1000) / 1000 ==
                Math.floor(vector3[2] * 1000) / 1000
            ) {
              neighbour = idx;
            }
          }

          // checking if this connection is already established
          let found = false;
          if (neighbour) {
            for (let i = 0; i < connections.length; i++) {
              // pushing new connection in order [index, neighbour], so if its already in, its index is [neighbour, index]
              if (
                connections[i][0] == neighbour &&
                connections[i][1] == index
              ) {
                found = true;
              }
            }
            // if the connection is not present, then add it to array
            if (!found) {
              connections.push([index, neighbour]);
            }
          }
        }
      });
    }
    return connections;
  };

  transformVertices = () => {
    // iterating through points and applying given transformation matrix - translations, rotations, scale
    console.log();
    let translationMatrix = mat4.create();
    translationMatrix = mat4.fromTranslation(
      translationMatrix,
      this.initialPosition
    );
    this.nodes.forEach((node) => {
      let pointGlMatrix = vec3.fromValues(
        node.position[0],
        node.position[1],
        node.position[2]
      );
      vec3.transformMat4(pointGlMatrix, pointGlMatrix, translationMatrix);
      vec3.copy(node.position, pointGlMatrix);
    });
  };

  update = (deltaTime, gravity) => {
    deltaTime *= this.timeMultiplier;
    this.nodes.forEach((node) => {
      // in the beggining of every frame only force is gravity
      vec3.set(node.forces, 0, gravity * this.mass, 0);
    });
    // updating every spring
    this.springs.forEach((spring) => {
      spring.update(deltaTime);
    });
    this.nodes.forEach((node) => {
      this.applyVelocityPositionChangeEuler(node, deltaTime);
    });
    // vertices are changed so we need to recalculate normals
    this.calculateVertexNormals();
  };

  applyVelocityPositionChangeEuler = (node, deltaTime) => {
    /** Integration - Euler method */
    // little bit of optimization to not create new vertices every frame, but reuse already initialized
    // a = F/m
    vec3.copy(this.motionVariables.acceleration, node.forces);
    vec3.scale(
      this.motionVariables.acceleration,
      this.motionVariables.acceleration,
      1 / this.mass
    );

    // integrating acceleration to get velocity difference
    // vec3.scale works pretty much like THREE.Vector3.multiplyScalar
    // v = a*dt
    vec3.scale(
      this.motionVariables.velocity,
      this.motionVariables.acceleration,
      deltaTime
    );

    // adding received velocity to current one
    vec3.add(node.velocity, node.velocity, this.motionVariables.velocity);

    // integrating velocity to get translation
    // x = v*dt
    vec3.scale(this.motionVariables.translation, node.velocity, deltaTime);

    // adding translation to current node position
    vec3.add(node.position, node.position, this.motionVariables.translation);

    // if node hits floor - its position in y axis is lower than 0,
    // then loose 50% energy and change direction of movement
    if (node.position[1] < 0) {
      node.position[1] = 0;
      node.velocity[1] *= -0.5;
    }

    // update position of mesh vertex
    node.correspondingVerticesIndices.forEach((index) => {
      this.attributes.vertices.data[index * 3 + 0] = node.position[0];
      this.attributes.vertices.data[index * 3 + 1] = node.position[1];
      this.attributes.vertices.data[index * 3 + 2] = node.position[2];
    });
  };

  applyVelocityPositionChangeRK4 = (node, deltaTime) => {
    // 4th order Runge-Kutta integration algorithm - unfortnatelly doesnt work as expected
    // little bit of optimization to not create new vertices every frame, but reuse already initialized
    // a = F/m
    vec3.copy(this.motionVariables.acceleration, node.forces);
    vec3.scale(
      this.motionVariables.acceleration,
      this.motionVariables.acceleration,
      1 / this.mass
    );

    // console.log('this.motionVariables.acceleration');
    // console.log(this.motionVariables.acceleration);
    // calculating step of acceleration
    let accelerationChange = vec3.create();
    vec3.subtract(
      accelerationChange,
      this.motionVariables.acceleration,
      node.acceleration
    );
    // console.log('accelerationChange');
    // console.log(accelerationChange);
    let accelerationStep = vec3.create();
    vec3.scale(accelerationStep, accelerationChange, 1 / 3);
    // console.log('accelerationStep');
    // console.log(accelerationStep);

    // acceleration * deltaTime
    const accelerationDeltaTime = vec3.create();
    const halfAccelerationDeltaTime = vec3.create();

    const reusableVector = vec3.create();
    // wspolczynniki do liczenia predkosci Vt+1
    const v1 = vec3.create();
    const v2 = vec3.create();
    const v3 = vec3.create();
    const v4 = vec3.create();
    const weightedSumVelocity = vec3.create();
    const finalVelocity = vec3.create();
    // same for position
    const p1 = vec3.create();
    const p2 = vec3.create();
    const p3 = vec3.create();
    const p4 = vec3.create();
    const weightedSumPosition = vec3.create();
    const finalPosition = vec3.create();
    // acceleration is constant => a1=a2=a3=a4
    const a1 = vec3.create();
    const a2 = vec3.create();
    const a3 = vec3.create();
    const a4 = vec3.create();

    // console.log('node.velocity');
    // console.log(node.velocity);
    // console.log('node.position');
    // console.log(node.position);
    // console.log('acceleration');
    // console.log(this.motionVariables.acceleration);

    //step1
    // v1
    vec3.copy(v1, node.velocity);
    //p1
    vec3.copy(p1, node.position);
    //a1
    vec3.copy(a1, node.acceleration);
    // console.log('v1 - powinno byc to samo co node.velocity');
    // console.log(v1);
    // console.log('p1 - powinno byc to samo co node.position');
    // console.log(p1);

    //step2
    //v2  = v1 + 0.5*dt*a1
    vec3.scale(halfAccelerationDeltaTime, a1, 0.5 * deltaTime); //0.5*dt*a1
    vec3.add(v2, v1, halfAccelerationDeltaTime); //v2  = v1 + 0.5*dt*a1
    //p2 = p1 + 0.5*dt*v1
    vec3.scale(reusableVector, v1, 0.5 * deltaTime); //0.5*dt*v1
    vec3.add(p2, p1, reusableVector); //p2 = p1 + 0.5*dt*v1
    //a2
    vec3.add(a2, a1, accelerationStep);
    // vec3.copy(a2, this.motionVariables.acceleration);
    // console.log('v2  = v1 + 0.5*dt*a1');
    // console.log(v2);
    // console.log('p2 = p1 + 0.5*dt*v1');
    // console.log(p2);

    //step3
    // v3 = v1+0.5*dt*a2
    vec3.scale(halfAccelerationDeltaTime, a2, 0.5 * deltaTime); //0.5*dt*a2
    vec3.add(v3, v1, halfAccelerationDeltaTime); // v3 = v1+0.5*dt*a2
    //p3 = p1 + 0.5*dt*v2
    vec3.scale(reusableVector, v2, 0.5 * deltaTime); //0.5*dt*v2
    vec3.add(p3, p1, reusableVector); //p3 = p1 + 0.5*dt*v2
    //a3
    vec3.add(a3, a2, accelerationStep);
    // vec3.copy(a3, this.motionVariables.acceleration);
    // console.log('v3  = v1 + 0.5*dt*a2');
    // console.log(v3);
    // console.log('p3 = p1 + 0.5*dt*v2');
    // console.log(p3);

    //step4
    //v4 = v1 + dt*a3
    vec3.scale(accelerationDeltaTime, a3, deltaTime); //dt*a3
    vec3.add(v4, v1, accelerationDeltaTime); //v4 = v1 + dt*a3
    //p4 = p1 + dt*v3
    vec3.scale(reusableVector, v3, deltaTime); //0.5*dt*v1
    vec3.add(p4, p1, reusableVector);
    //a4
    vec3.add(a4, a3, accelerationStep);
    // vec3.copy(a4, this.motionVariables.acceleration);

    // v[t+1] = v[t] + dt*(1/6)*(a1+2a2+2a3+a4)
    //calculating weighted sum of position
    vec3.scale(a2, a2, 2); // 2* a2
    vec3.scale(a3, a3, 2); // 2 * a3
    vec3.add(weightedSumVelocity, a1, a2); // a1+2a2
    vec3.add(weightedSumVelocity, weightedSumVelocity, a3); // a1+2a2+2a3
    vec3.add(weightedSumVelocity, weightedSumVelocity, a4); // a1+2a2+2a3+a4
    vec3.scale(weightedSumVelocity, weightedSumVelocity, 1 / 6); //(1/6)*(a1+2a2+2a3+a4)
    vec3.scale(weightedSumVelocity, weightedSumVelocity, deltaTime); //dt*(1/6)*(a1+2a2+2a3+a4)
    // final result
    vec3.add(finalVelocity, node.velocity, weightedSumVelocity);

    vec3.copy(node.velocity, finalVelocity);

    // p[t+1] = p[t] + dt*(1/6)*(v1+2v2+2v3+v4)
    //calculating weighted sum of velocity
    vec3.scale(v2, v2, 2); // 2* v2
    vec3.scale(v3, v3, 2); // 2 * v3
    vec3.add(weightedSumPosition, v1, v2); // v1+2v2
    vec3.add(weightedSumPosition, weightedSumPosition, v3); // v1+2v2+2v3
    vec3.add(weightedSumPosition, weightedSumPosition, v4); // v1+2v2+2v3+v4
    vec3.scale(weightedSumPosition, weightedSumPosition, 1 / 6); //(1/6)*(v1+2v2+2v3+v4)
    vec3.scale(weightedSumPosition, weightedSumPosition, deltaTime); //dt*(1/6)*(v1+2v2+2v3+v4)
    // final result
    vec3.add(finalPosition, node.position, weightedSumPosition);

    vec3.copy(node.position, finalPosition);

    vec3.copy(node.acceleration, this.motionVariables.acceleration);
    // if node hits floor - its position in y axis is lower than 0,
    // then loose 50% energy and change direction of movement
    if (node.position[1] < 0) {
      node.position[1] = 0;
      node.velocity[1] *= -0.5;
    }

    // update position of mesh vertex
    node.correspondingVerticesIndices.forEach((index) => {
      this.attributes.vertices.data[index * 3 + 0] = node.position[0];
      this.attributes.vertices.data[index * 3 + 1] = node.position[1];
      this.attributes.vertices.data[index * 3 + 2] = node.position[2];
    });
  };
}
