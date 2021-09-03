import {VertexArray} from './VertexArray';
import {VertexAttributes} from './VertexAttributes';
import {ShaderProgram} from './ShaderProgram';

const canvas = document.getElementById('canvas');
const textarea = document.getElementById('function');
window.gl = canvas.getContext('webgl2');

function render() {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  shaderProgram.bind();
  shaderProgram.setUniform2f("dimensions", canvas.width, canvas.height);
  shaderProgram.setUniform2f("mouse", window.mouseX, window.mouseY);
  shaderProgram.setUniform1f("time", window.seconds);
  vertexArray.bind();
  vertexArray.drawSequence(gl.TRIANGLE_STRIP);
  vertexArray.unbind();
  shaderProgram.unbind();
}

function onSizeChanged() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  render();
}

function mouseMove(e) {
  window.mouseX = parseFloat(""+e.pageX);
  window.mouseY = parseFloat(""+e.pageY);
  render();
}

function secondPassed() {
  window.seconds = window.seconds + 0.01;
  render();
}

function assembleShader() {

  var functionText = textarea.value;

  var fragmentSource = `
  out vec4 fragmentColor;

  uniform vec2 dimensions;
  uniform vec2 mouse;
  uniform float time;

  vec3 f()
  {
    vec3 color;
    ${ functionText }
    return color;
  }

  void main() {
    vec3 color = f();
    fragmentColor = vec4(color, 1.0);
  }
  `;
  try {
    window.shaderProgram.destroy();
    window.shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
  } catch (e)
  {
    console.log(e);
    window.shaderProgram.destroy();
    window.shaderProgram = new ShaderProgram(vertexSource, defaultFragmentSource);
  }
  render();
}

async function initialize() {

  const positions = [
    -1, -1, 0,
     1, -1, 0,
    -1,  1, 0,
     1,  1, 0,
  ];

  const attributes = new VertexAttributes();
  attributes.addAttribute('position', 4, 3, positions);

  window.vertexSource = `
  in vec3 position;

  void main() {
    gl_Position = vec4(position, 1.0);
  }
  `;

  window.defaultFragmentSource = `
  out vec4 fragmentColor;

  uniform vec2 dimensions;
  uniform vec2 mouse;
  uniform float time;

  vec3 f()
  {
    vec3 color = vec3(0);
    return color;
  }

  void main() {
    vec3 color = f();
    fragmentColor = vec4(color, 1.0);
  }
  `;

  window.shaderProgram = new ShaderProgram(vertexSource, defaultFragmentSource);
  window.vertexArray = new VertexArray(shaderProgram, attributes);
  textarea.addEventListener('input', assembleShader);
  window.addEventListener('resize', onSizeChanged);
  document.addEventListener('mousemove', mouseMove);
  window.seconds = 0;
  window.setInterval(secondPassed, 10);
  window.mouseX = 0;
  window.mouseY = 0;
  onSizeChanged();
}

initialize();