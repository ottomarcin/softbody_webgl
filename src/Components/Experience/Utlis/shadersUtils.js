export function setProgram(gl, vertexShader, fragmentShader) {
  /**
   * Setting up the shaders
   */
  // vertex shader
  const vertex = setShader(gl, gl.VERTEX_SHADER, vertexShader);
  // fragment shader
  const fragment = setShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  // program
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  checkShaderProgramLinking(gl, program); //throws error if something's wrong
  return program;
}

// checking if shader is compiled correctly
export function checkShaderCompilation(gl, shader) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error compiling shader`, gl.getShaderInfoLog(shader));
  }
}

// chcecking if the shader program is linked correctly
export function checkShaderProgramLinking(gl, program) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Error linking program`, gl.getProgramInfoLog(program));
    return;
  }
}

// wrapper for seting up vertex/fragment shader
export function setShader(gl, type, source) {
  // const shader = gl.createShader(gl.VERTEX_SHADER);
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  checkShaderCompilation(gl, shader);
  return shader;
}
