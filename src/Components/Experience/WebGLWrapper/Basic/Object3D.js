import { mat4, vec3 } from 'gl-matrix';

export default class Object3D {
  constructor(name = 'Object3D', color = [0.184, 0.184, 0.184]) {
    // setting object's name
    this.name = name;
    this.color = color;
    this.visible = true;

    // creating empty matrices
    this.scaleVector = vec3.create();
    this.scaleMatrix = mat4.create();
    this.rotationMatrix = mat4.create();
    this.translationMatrix = mat4.create();
    this.modelToWorldMatrix = mat4.create();

    // creating templates for attributes - vertices, uvs, normals, indices etc
    this.attributes = {
      vertices: {
        attributeName: 'aPosition',
        data: undefined,
        elementsPerAttribute: 3,
      },
      indices: {
        attributeName: 'aIndex',
        data: undefined,
        elementsPerAttribute: 3,
      },
      uv: {
        attributeName: 'aUv',
        data: undefined,
        elementsPerAttribute: 2,
      },
      colors: {
        attributeName: 'aColor',
        data: undefined,
        elementsPerAttribute: 3,
      },
      normals: {
        attributeName: 'aNormal',
        data: undefined,
        elementsPerAttribute: 3,
      },
    };
  }

  updateAttribute = (type, data) => {
    // type can be one of: vertices, indices, uv, colors, normals
    this.attributes[type].data = data;
  };
  setScale = (X, Y, Z) => {
    vec3.set(this.scaleVector, X, Y, Z);
    mat4.fromScaling(this.scaleMatrix, this.scaleVector);
  };
  rotateX = (radAngle) => {
    mat4.rotateX(this.rotationMatrix, this.rotationMatrix, radAngle);
  };
  rotateY = (radAngle) => {
    mat4.rotateY(this.rotationMatrix, this.rotationMatrix, radAngle);
  };
  rotateZ = (radAngle) => {
    mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, radAngle);
  };
  translate = (X, Y, Z) => {
    mat4.translate(this.translationMatrix, this.translationMatrix, [X, Y, Z]);
  };
  calculateModelToWorldMatrix = () => {
    const scaleRotationMatrix = mat4.create();
    mat4.multiply(scaleRotationMatrix, this.rotationMatrix, this.scaleMatrix);
    mat4.multiply(
      this.modelToWorldMatrix,
      this.translationMatrix,
      scaleRotationMatrix
    );
  };
  getPosition = () => {
    return {
      x: this.translationMatrix[12],
      y: this.translationMatrix[13],
      z: this.translationMatrix[14],
    };
  };
  setPosition = (X, Y, Z) => {
    const currentPosition = vec3.fromValues(
      this.translationMatrix[12],
      this.translationMatrix[13],
      this.translationMatrix[14]
    );

    const desiredPosition = vec3.fromValues(X, Y, Z);
    let difference = vec3.create();
    vec3.subtract(difference, desiredPosition, currentPosition);
    this.translate(difference[0], difference[1], difference[2]);
    this.calculateModelToWorldMatrix();
  };

  getBoundingBox = () => {
    let boundingBox = [
      { x: Infinity, y: Infinity, z: Infinity }, // smaller point
      { x: -Infinity, y: -Infinity, z: -Infinity }, //larger point
    ];
    const vertices = this.attributes.vertices.data;
    for (let i = 0; i < vertices.length / 3; i++) {
      let point = vec3.fromValues(
        vertices[i * 3 + 0],
        vertices[i * 3 + 1],
        vertices[i * 3 + 2]
      );
      this.calculateModelToWorldMatrix();
      vec3.transformMat4(point, point, this.modelToWorldMatrix);
      //checking smaller point
      if (point[0] < boundingBox[0].x) {
        boundingBox[0].x = point[0];
      }
      if (point[1] < boundingBox[0].y) {
        boundingBox[0].y = point[1];
      }
      if (point[2] < boundingBox[0].z) {
        boundingBox[0].z = point[2];
      }
      //checking larger point
      if (point[0] > boundingBox[1].x) {
        boundingBox[1].x = point[0];
      }
      if (point[1] > boundingBox[1].y) {
        boundingBox[1].y = point[1];
      }
      if (point[2] > boundingBox[1].z) {
        boundingBox[1].z = point[2];
      }
    }
    return boundingBox;
  };
  calculateVertexNormals = () => {
    const indices = this.attributes.indices.data;
    const vertices = this.attributes.vertices.data;
    const newNormals = new Float32Array(this.attributes.normals.data.length); // empty array for new normals
    //initializing new vectors to reuse
    const pA = vec3.create();
    const pB = vec3.create();
    const pC = vec3.create();
    const ab = vec3.create();
    const cb = vec3.create();
    const normal = vec3.create();

    for (let index = 0; index < indices.length / 3; index++) {
      // getting indices of current face
      const currentIndices = [
        indices[index * 3 + 0],
        indices[index * 3 + 1],
        indices[index * 3 + 2],
      ];

      // values of vertices of first point
      vec3.set(
        pA,
        vertices[currentIndices[0] * 3 + 0],
        vertices[currentIndices[0] * 3 + 1],
        vertices[currentIndices[0] * 3 + 2]
      );
      // values of vertices of second point
      vec3.set(
        pB,
        vertices[currentIndices[1] * 3 + 0],
        vertices[currentIndices[1] * 3 + 1],
        vertices[currentIndices[1] * 3 + 2]
      );
      // values of vertices of third point
      vec3.set(
        pC,
        vertices[currentIndices[2] * 3 + 0],
        vertices[currentIndices[2] * 3 + 1],
        vertices[currentIndices[2] * 3 + 2]
      );

      //getting tangent and bitangent
      vec3.subtract(cb, pC, pB);
      vec3.subtract(ab, pA, pB);
      //normal
      vec3.cross(normal, cb, ab);
      //normalizing new normal
      vec3.normalize(normal, normal);

      //setting values in new normals array
      newNormals[currentIndices[0] * 3 + 0] = normal[0];
      newNormals[currentIndices[0] * 3 + 1] = normal[1];
      newNormals[currentIndices[0] * 3 + 2] = normal[2];

      newNormals[currentIndices[1] * 3 + 0] = normal[0];
      newNormals[currentIndices[1] * 3 + 1] = normal[1];
      newNormals[currentIndices[1] * 3 + 2] = normal[2];

      newNormals[currentIndices[2] * 3 + 0] = normal[0];
      newNormals[currentIndices[2] * 3 + 1] = normal[1];
      newNormals[currentIndices[2] * 3 + 2] = normal[2];
    }
    this.updateAttribute('normals', newNormals);
  };
}
