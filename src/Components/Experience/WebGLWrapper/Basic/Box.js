import Object3D from '../Basic/Object3D';

export default class Box extends Object3D {
  // https://github.com/mrdoob/three.js/blob/master/src/geometries/BoxGeometry.js
  constructor(
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
    color = [0.847, 0.855, 0.827],
    position = [0, 0, 0],
    name = 'Box'
  ) {
    super(name, color);
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.depthSegments = depthSegments;

    const vertices = [];
    const colors = [];
    const uv = [];
    const normals = [];
    const indices = [];
    // nz;
    this.generateSide(
      'x',
      'y',
      'z',
      -1,
      -1,
      -1,
      this.width,
      this.height,
      this.depth,
      this.widthSegments,
      this.heightSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );
    //ny
    this.generateSide(
      'x',
      'z',
      'y',
      1,
      -1,
      -1,
      this.width,
      this.depth,
      this.height,
      this.widthSegments,
      this.depthSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );
    //nx
    this.generateSide(
      'z',
      'y',
      'x',
      1,
      -1,
      -1,
      this.depth,
      this.height,
      this.width,
      this.depthSegments,
      this.heightSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );
    //pz
    this.generateSide(
      'x',
      'y',
      'z',
      1,
      -1,
      1,
      this.width,
      this.height,
      this.depth,
      this.widthSegments,
      this.heightSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );
    //py
    this.generateSide(
      'x',
      'z',
      'y',
      1,
      1,
      1,
      this.width,
      this.depth,
      this.height,
      this.widthSegments,
      this.depthSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );
    //px
    this.generateSide(
      'z',
      'y',
      'x',
      -1,
      -1,
      1,
      this.depth,
      this.height,
      this.width,
      this.depthSegments,
      this.heightSegments,
      vertices,
      colors,
      normals,
      indices,
      uv
    );

    this.updateAttribute('vertices', new Float32Array(vertices.flat()));
    this.updateAttribute('indices', new Uint16Array(indices));
    this.updateAttribute('uv', new Float32Array(uv));
    this.updateAttribute('colors', new Float32Array(colors));
    this.updateAttribute('normals', new Float32Array(normals.flat()));

    this.translate(...position);
  }

  // function generating plane at chosen axes, sizes and number of segments within each axis
  generateSide = (
    widthAxis, // axis of plane width
    heightAxis, // axis of plane height
    depthAxis, // axis perpendicular to plane
    widthAxisDirection, // direction of plane width axis
    heightAxisDirection, // direction of plane height axis
    depthAxisDirection, // direction of plane depth axis
    width, //width of plane
    height, //height of plane
    depth, // twice the position in axis perpendicular to plane
    widthSegments, //number of segments in width direction
    heightSegments, //number of segments in height direction
    vertices, // vertices array where values will be pushed
    colors, // colors array where values will be pushed
    normals, // normals array where values will be pushed
    indices, // indices array where values will be pushed
    uv //  uv array where values will be pushed
  ) => {
    // width ('x coordinate') of every segment
    const widthDistance = width / widthSegments;
    // height ('y coordinate') of every segment
    const heightDistance = height / heightSegments;
    // distance in axis perpendicular to plane (position will be depthHalf multiplied by depthAxisDirection)
    const depthHalf = depth / 2;

    // get vertices number before generating new ones
    const verticesNumber = vertices.length;

    /**
     * Calculating vertices, normals and colors
     */

    // creating vertex object, with x, y, z component, it makes possible vertex[axis] notation
    let vertex = {
      x: undefined,
      y: undefined,
      z: undefined,
    };

    for (let heightIndex = 0; heightIndex < heightSegments + 1; heightIndex++) {
      // calculating vertex value for y axis
      const y = heightIndex * heightDistance - height / 2;
      for (let widthIndex = 0; widthIndex < widthSegments + 1; widthIndex++) {
        // calculating vertex value for x axis
        const x = widthIndex * widthDistance - width / 2;
        // assigning vertex values to correct axis
        vertex[widthAxis] = x * widthAxisDirection;
        vertex[heightAxis] = y * heightAxisDirection;
        vertex[depthAxis] = depthHalf * depthAxisDirection;
        vertices.push(Object.values(vertex)); // pushing only values from vertex object
        // calculating random colors
        colors.push(Math.random(), Math.random(), Math.random());
        //uvs
        const u = widthIndex / widthSegments;
        const v = 1 - heightIndex / heightSegments;
        uv.push(u, v);

        // calculating normals
        vertex[widthAxis] = 0;
        vertex[heightAxis] = 0;
        vertex[depthAxis] = depthAxisDirection;
        normals.push(Object.values(vertex)); // pushing only values of vertex (containing normals here) object
      }
    }

    /**
     * Calculating indices for faces
     */

    for (let heightIndex = 0; heightIndex < heightSegments; heightIndex++) {
      for (let widthIndex = 0; widthIndex < widthSegments; widthIndex++) {
        const a =
          verticesNumber + widthIndex + (widthSegments + 1) * heightIndex;
        const b =
          verticesNumber + widthIndex + (widthSegments + 1) * (heightIndex + 1);
        const c =
          verticesNumber +
          widthIndex +
          1 +
          (widthSegments + 1) * (heightIndex + 1);
        const d =
          verticesNumber + widthIndex + 1 + (widthSegments + 1) * heightIndex;

        // faces
        indices.push(a, b, d, b, c, d);
      }
    }
  };
}
