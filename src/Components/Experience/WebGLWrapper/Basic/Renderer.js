import vertex from '../../shaders/vertex.glsl.js';
import fragmentLambert from '../../shaders/fragmentLambert.glsl.js';
import { setProgram } from '../../Utlis/shadersUtils';
import fragmentNormals from '../../shaders/fragmentNormals.glsl.js';

class Renderer {
  constructor(canvas, sizes) {
    // getting stuffed passed at constructor
    this.canvas = canvas;
    this.sizes = sizes;
    this.gl = canvas.getContext('webgl');
    this.buffers = {}; // in this objects will be stored buffers for various objects
    this.uniformsLocations = {}; // here will be stored locations of uniforms - matrices, colors etc.

    // program resulting from webgl consisting of vertex and fragment shaders, initialized in init method
    this.program = undefined;
    // program options - shading based on user input
    this.programOptions = {
      lambertShading: undefined,
      normalsShading: undefined,
    };
    // calling init function to get renderer working
    this.init();
  }

  init = () => {
    console.log('Initializing renderer');
    /**
     * Resizing, seting color, clearing buffers etc.
     */
    this.resize();
    // Making sure that objects are drawn correctly regarding depth position
    this.gl.enable(this.gl.DEPTH_TEST);
    //increasing performance, by drawing just one side of faces
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.frontFace(this.gl.CCW);
    this.gl.cullFace(this.gl.BACK);

    // Setting up the programs - one for lambert and one for normals shading
    this.programOptions.lambertShading = setProgram(
      this.gl,
      vertex,
      fragmentLambert
    );
    this.programOptions.normalsShading = setProgram(
      this.gl,
      vertex,
      fragmentNormals
    );
    this.setProgram('lambertShading');
    // initilizing buffers for attributes
    this.initBuffers();
    this.setUniformsLocations();
  };

  setProgram = (shadingType) => {
    this.program = this.programOptions[shadingType];
    this.setUniformsLocations();
  };

  initBuffers = () => {
    // initializing buffers for all the attributes used in vertex shader
    // property name has to be the same as attribute name in vertex shader
    this.buffers.aPosition = {
      target: this.gl.ARRAY_BUFFER,
      buffer: this.gl.createBuffer(),
    };
    this.buffers.aColor = {
      target: this.gl.ARRAY_BUFFER,
      buffer: this.gl.createBuffer(),
    };
    this.buffers.aUv = {
      target: this.gl.ARRAY_BUFFER,
      buffer: this.gl.createBuffer(),
    };
    this.buffers.aNormal = {
      target: this.gl.ARRAY_BUFFER,
      buffer: this.gl.createBuffer(),
    };
    this.buffers.aIndex = {
      target: this.gl.ELEMENT_ARRAY_BUFFER,
      buffer: this.gl.createBuffer(),
    };
  };

  setUniformsLocations = () => {
    this.uniformsLocations.modelToWorldMatrix = this.gl.getUniformLocation(
      this.program,
      'uModelToWorldMatrix'
    );
    this.uniformsLocations.viewMatrix = this.gl.getUniformLocation(
      this.program,
      'uViewMatrix'
    );
    this.uniformsLocations.projectionMatrix = this.gl.getUniformLocation(
      this.program,
      'uProjectionMatrix'
    );
    this.uniformsLocations.color = this.gl.getUniformLocation(
      this.program,
      'uColor'
    );
  };

  // method rendering whole scene - called in loop with requestAnimationFrame
  render = (scene, camera) => {
    this.gl.useProgram(this.program);
    // setting camera matrices - calculating every camera manipulations - position, fov etc.
    this.setCameraMatrices(camera);
    // clearing buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // looping through every child of scene (object to draw)
    scene.children.forEach((child) => {
      if (child.visible) {
        // setting color of drawn object
        this.gl.uniform3fv(this.uniformsLocations.color, child.color);
        // updating attributes of objects
        Object.values(child.attributes).forEach((attribute) => {
          // we need to treat indices attribute a bit different
          if (attribute.attributeName != 'aIndex') {
            this.updateAttribute(
              attribute.data,
              attribute.attributeName,
              attribute.elementsPerAttribute
            );
          } else {
            //binding indices - its not passed to vertex shader as 'normal' attribute
            this.bindDataToBuffer(
              attribute.data,
              this.buffers.aIndex.target,
              this.buffers.aIndex.buffer
            );
          }
        });
        // calculating matrix of each object in the scene
        child.calculateModelToWorldMatrix();
        // sending modelToViewMatrix to vertex shader
        this.setModelToWorldMatrix(child.modelToWorldMatrix);
        // drawing element
        this.gl.drawElements(
          this.gl.TRIANGLES,
          child.attributes.indices.data.length,
          this.gl.UNSIGNED_SHORT,
          0
        );
      }
    });
  };

  setModelToWorldMatrix = (modelToWorldMatrix) => {
    // passing vertex shader modelToWorldMatrix of object as an uniform
    this.gl.uniformMatrix4fv(
      this.uniformsLocations.modelToWorldMatrix,
      this.gl.FALSE,
      modelToWorldMatrix
    );
  };

  setCameraMatrices = (camera) => {
    //view matrix
    this.gl.uniformMatrix4fv(
      this.uniformsLocations.viewMatrix,
      this.gl.FALSE,
      camera.viewMatrix
    );

    //projection matrix
    this.gl.uniformMatrix4fv(
      this.uniformsLocations.projectionMatrix,
      this.gl.FALSE,
      camera.projectionMatrix
    );
  };

  resize = () => {
    // matching webgl sizes with the sizes of canvas
    this.gl.viewport(
      0,
      0,
      this.sizes.width * this.sizes.pixelRatio,
      this.sizes.height * this.sizes.pixelRatio
    );
  };

  //function to add vertices of another object to draw in canvas
  updateAttribute = (data, attributeName, elementsPerAttribute) => {
    const { target, buffer } = this.buffers[attributeName];
    this.bindDataToBuffer(data, target, buffer);
    // geting position of an attribute in webgl shader
    // attributeName of atribute is defined in vertex shader
    const positionAttribLocation = this.gl.getAttribLocation(
      this.program,
      attributeName
    );
    // specifying layout of the attribute
    this.gl.vertexAttribPointer(
      positionAttribLocation, //attribute location
      elementsPerAttribute, //number of elements per attribute - for vec2 = 2, vec3 = 3 and so on,
      this.gl.FLOAT, //type of each element in data
      this.gl.FALSE, // not normalized
      elementsPerAttribute * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
      0 //offset from beggining
    );
    this.gl.enableVertexAttribArray(positionAttribLocation);
  };

  bindDataToBuffer = (data, target, buffer, dynamic = false) => {
    this.gl.bindBuffer(target, buffer); //setting the buffer as array buffer
    // specifying the data on active buffer
    this.gl.bufferData(
      target,
      data, // projecting data as data accepted by webgl, new Float32Array(data) or new Uint16Array(data) is now inside object
      dynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW
    );
  };
}

export default Renderer;
