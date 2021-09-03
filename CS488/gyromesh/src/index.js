import { VertexArray } from './VertexArray';
import { VertexAttributes } from './VertexAttributes';
import { ShaderProgram } from './ShaderProgram';
import { Vector2, Vector3 } from './Vector';
import { Matrix4 } from './Matrix';
import { Trackball } from './Trackball'
const canvas = document.getElementById('canvas');
window.gl = canvas.getContext('webgl2');
const baseLightPosition = new Vector3(1.0, 1.0, 1.0);

let bounds = [0, 0];
let modelScalar = 1;
let vertexArray;
let shaderProgram;
let vertexSource;
let fragmentSource;
let projectionMatrix;
let isLeftMouseDown;
let trackball;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  shaderProgram.bind();
  shaderProgram.setUniform3f("lightPosition", baseLightPosition.x * modelScalar, baseLightPosition.y * modelScalar, baseLightPosition.z * modelScalar);
  shaderProgram.setUniformMatrix4("projection", projectionMatrix);
  shaderProgram.setUniformMatrix4("model", trackball.rotation);
  vertexArray.bind();
  vertexArray.drawIndexed(gl.TRIANGLES);
  vertexArray.unbind();
  shaderProgram.unbind();
}

function onSizeChanged() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  trackball.setViewport(canvas.width, canvas.height);
  projectionMatrix = new Matrix4().createOrthoProjectionMatrix4(canvas.width / canvas.height, bounds[0], bounds[1], bounds[0], bounds[1], bounds[1], bounds[0]); // TODO modify and take from loadObjMethod
  render();
}

async function loadObj(filename) {
  await fetch(filename).then(response => response.text()).then(responseText => {
    const positionsVectors = [0, 0, 0,];
    const normalsVectors = [0, 0, 0,];
    const positionsIndicies = [0,];
    const normalsIndicies = [0,];
    const positions = [];
    const normals = [];
    const indicies = [];
    var lines = responseText.split("\n");
    for (var i = 0; i < lines.length; i++) {

      if (lines[i].startsWith("vn")) {
        var coords = lines[i].split(" ");
        normalsVectors.push(parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
      }
      else if (lines[i].startsWith("v") && !lines[i].startsWith('vt')) {
        var coords = lines[i].split(" ");
        positionsVectors.push(parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
        recalcBounds(parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
      }
      else if (lines[i].startsWith("f")) {
        var points = lines[i].split(" ");
        var vertexData = points[1].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
        vertexData = points[2].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
        vertexData = points[3].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
      }
    }
    for (var i = 1; i < positionsIndicies.length; i++) {
      var toAddx = positionsVectors[positionsIndicies[i] * 3 + 0];
      var toAddy = positionsVectors[positionsIndicies[i] * 3 + 1];
      var toAddz = positionsVectors[positionsIndicies[i] * 3 + 2];
      positions.push(toAddx, toAddy, toAddz);
      toAddx = normalsVectors[normalsIndicies[i] * 3 + 0];
      toAddy = normalsVectors[normalsIndicies[i] * 3 + 1];
      toAddz = normalsVectors[normalsIndicies[i] * 3 + 2];
      normals.push(toAddx, toAddy, toAddz);
      indicies.push(i - 1);
    }
    const attributes = new VertexAttributes();

    attributes.addAttribute('position', positions.length / 3, 3, positions);
    attributes.addIndices(indicies);
    attributes.addAttribute('normal', normals.length / 3, 3, normals);
    vertexArray = new VertexArray(shaderProgram, attributes);
  });
}

function recalcBounds(x, y, z) {
  if (x < bounds[0]) bounds[0] = x;
  if (x > bounds[1]) bounds[1] = x;
  if (y < bounds[0]) bounds[0] = y;
  if (y > bounds[1]) bounds[1] = y;
  if (z < bounds[0]) bounds[0] = z;
  if (z > bounds[1]) bounds[1] = z;
  if (bounds[1] > Math.abs(bounds[0]))
  {
    bounds[0] = -bounds[1];
  }
  else
  {
    bounds[1] = -bounds[0];
  }
  modelScalar = 2 * bounds[1];
}

async function initialize() {
  trackball = new Trackball();
  vertexSource = `
  in vec3 position;
  in vec3 normal;

  uniform mat4 model;
  uniform mat4 projection;

  out vec3 fnormal;
  out vec3 positionEye;

  void main() {
    gl_Position = projection * model * vec4(position, 1.0);
    fnormal = (model * vec4(normal, 0.0)).xyz;
    positionEye = (projection * model * vec4(position, 1.0)).xyz;
  }
  `;

  fragmentSource = `
  const float ambientWeight = 0.1;
  const float shininess = 100.0;
  const vec3 lightColor = vec3(1.0);
  const vec3 albedo = vec3(.66274);
  
  in vec3 fnormal;
  in vec3 positionEye;

  uniform vec3 lightPosition;

  out vec4 fragmentColor;

  void main() {
    vec3 lightVector = normalize(lightPosition - positionEye);
    vec3 normal = normalize(fnormal);
    float litness = max(0.0, dot(normal, lightVector));
    vec3 diffuse = litness * lightColor * (1.0 - ambientWeight);
    vec3 ambient = lightColor * ambientWeight;
    vec3 eyeVector = -normalize(positionEye);
    vec3 halfVector = normalize(lightVector + eyeVector);
    float specularity = max(0.0, dot(halfVector, normal));
    vec3 specular = vec3(1.0) * pow(specularity, shininess);
    vec3 rgb = (ambient + diffuse) * albedo + specular;
    fragmentColor = vec4(rgb, 1.0);
  }
  `;
  gl.clearColor(0.85, 0.85, 0.85, 1);
  shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
  await loadObj("stall.obj");
  window.addEventListener('resize', onSizeChanged);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseDrag);
  onSizeChanged();
}

function onMouseDown(event) {
  if (event.button === 0) {
    isLeftMouseDown = true;
    const mousePixels = new Vector2(event.clientX, canvas.height - event.clientY);
    trackball.start(mousePixels);
  }
}

function onMouseDrag(event) {
  if (isLeftMouseDown) {
    const mousePixels = new Vector2(event.clientX, canvas.height - event.clientY);
    trackball.drag(mousePixels, 1);
    render();
  }
}

function onMouseUp(event) {
  if (isLeftMouseDown) {
    isLeftMouseDown = false;
    const mousePixels = new Vector2(event.clientX, canvas.height - event.clientY);
    var diff = trackball.end(mousePixels);
    if (diff > 10) {
      requestAnimationFrame(rotateObj);
    }
  }
}

function rotateObj() {
  trackball.autoRotate(2.0);
  render();
  if (!isLeftMouseDown)
  {
    requestAnimationFrame(rotateObj);
  }
}

initialize();