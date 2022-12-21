import Object3D from './Object3D';

export default class Plane extends Object3D {
  constructor(
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
    name,
    color
  ) {
    super(name, color);
    this.width = width;
    this.height = height;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    //generating vertices so plane is pointing up y axis at y=0
    const { vertices, colors, normals, indices, uv } = this.generatePlane(
      'x',
      'z',
      'y',
      1,
      1,
      1,
      this.width,
      this.height,
      0,
      this.widthSegments,
      this.heightSegments
    );

    // setting attributes retrieved by generatePlane method
    this.updateAttribute('vertices', new Float32Array(vertices.flat()));
    this.updateAttribute('indices', new Uint16Array(indices));
    this.updateAttribute('uv', new Float32Array(uv));
    this.updateAttribute('colors', new Float32Array(colors));
    this.updateAttribute('normals', new Float32Array(normals.flat()));
  }

  // function generating plane at chosen axes, sizes and number of segments within each axis
  generatePlane = (
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
    heightSegments //number of segments in height direction
  ) => {
    let vertices = [],
      colors = [],
      normals = [],
      indices = [],
      uv = [];
    // width ('x coordinate') of every segment
    const widthDistance = width / widthSegments;
    // height ('y coordinate') of every segment
    const heightDistance = height / heightSegments;
    // distance in axis perpendicular to plane (position will be depthHalf multiplied by depthAxisDirection)
    const depthHalf = depth / 2;

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
        const a = widthIndex + (widthSegments + 1) * heightIndex;
        const b = widthIndex + (widthSegments + 1) * (heightIndex + 1);
        const c = widthIndex + 1 + (widthSegments + 1) * (heightIndex + 1);
        const d = widthIndex + 1 + (widthSegments + 1) * heightIndex;

        // faces
        indices.push(a, b, d, b, c, d);
      }
    }

    return { vertices, colors, normals, indices, uv };
  };
}
