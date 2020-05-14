import { createUniformSetters, setUniforms } from "./uniforms.js";
import { getVao } from "./vao.js";

export function initProgram(gl, vertexSrc, fragmentSrc) {
  const program = gl.createProgram();
  gl.attachShader(program, loadShader(gl, gl.VERTEX_SHADER, vertexSrc));
  gl.attachShader(program, loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    fail("Unable to link the program", gl.getProgramInfoLog(program));
  }

  const uniformSetters = createUniformSetters(gl, program);

  function constructVao(attributeState) {
    return getVao(gl, program, attributeState);
  }

  function setupDraw({ uniforms, vao }) {
    gl.useProgram(program);
    setUniforms(uniformSetters, uniforms);
    gl.bindVertexArray(vao);
  }

  return { gl, constructVao, setupDraw };
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    fail("An error occured compiling the shader", log);
  }

  return shader;
}

function fail(msg, log) {
  throw Error("yawgl.initProgram: " + msg + ":\n" + log);
}