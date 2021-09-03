import { VertexArray } from './VertexArray';
import { VertexAttributes } from './VertexAttributes';
import { ShaderProgram } from './ShaderProgram';
import { Vector3 } from './Vector';
import { Matrix4 } from './Matrix';
const canvas = document.getElementById('canvas');
window.gl = canvas.getContext('webgl2');

let vertexArray;
let shaderProgram;
let vertexSource;
let fragmentSource;
let clipSize;
let boxes;
let projectionMatrix;
let rotationMatrix = new Matrix4();
let xRot;
let yRot;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  shaderProgram.bind();
  shaderProgram.setUniformMatrix4("projection", projectionMatrix);
  shaderProgram.setUniformMatrix4("rotation", rotationMatrix);
  vertexArray.bind();
  for (var i = 0; i < boxes.length; i++) {
    shaderProgram.setUniform3f("color", boxes[i].color.x, boxes[i].color.y, boxes[i].color.z)
    shaderProgram.setUniformMatrix4("transformation", boxes[i].matrix);
    vertexArray.drawIndexed(gl.TRIANGLES);
  }
  vertexArray.unbind();
  shaderProgram.unbind();
}

function onSizeChanged() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  projectionMatrix = new Matrix4().createOrthoProjectionMatrix4(canvas.width / canvas.height, clipSize[0], clipSize[1], clipSize[4], clipSize[5], clipSize[3], clipSize[2]);
  render();
}

async function loadFile(filename) {
  var text = (await fetch(filename)).text();
  var lines = (await text).split("\n");
  for (var i = 0; i < lines.length; i++) {
    var values = (await lines[i]).split(" ");
    var position = new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
    var scale = new Vector3(parseFloat(values[3]) / 2, parseFloat(values[4]) / 2, parseFloat(values[5]) / 2);
    var mat = new Matrix4().createModelMatrix4(position, 0, 0, 0, scale);
    if (values.length == 6) {
      boxes.push({ matrix: mat, color: new Vector3(Math.random(), Math.random(), Math.random()) });
    }
    else if (values.length == 9) {
      boxes.push({ matrix: mat, color: new Vector3(parseFloat(values[6]) / 255, parseFloat(values[7]) / 255, parseFloat(values[8]) / 255) });
    }
    checkBoundingBox(position, scale);
  }
}

function checkBoundingBox(position, scale) {
  if (position.x - scale.x < clipSize[0]) {
    clipSize[0] = position.x - scale.x;
  }
  if (position.x + scale.x > clipSize[1]) {
    clipSize[1] = position.x + scale.x;
  }
  if (position.y - scale.y < clipSize[2]) {
    clipSize[2] = position.y - scale.y;
  }
  if (position.y + scale.y > clipSize[3]) {
    clipSize[3] = position.y + scale.y;
  }
  if (position.z - scale.z < clipSize[4]) {
    clipSize[4] = position.z - scale.z;
  }
  if (position.z + scale.z > clipSize[5]) {
    clipSize[5] = position.z + scale.z;
  }
}

function onKeyPress(event)
{
  var changed = false;
  if (event.key == 'w')
  {
    xRot += 5;
  }
  if (event.key == 'd')
  {
    yRot -= 5;
  }
  if (event.key == 'a')
  {
    yRot += 5;
  }
  if (event.key == 's')
  {
    xRot -= 5;
  }
  rotationMatrix = new Matrix4().createModelMatrix4(new Vector3(), xRot, yRot, 0, new Vector3(1, 1, 1));
  onSizeChanged();
}

async function initialize() {

  const positions = [
    //side
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    //side
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    //side
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    //side
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    // side
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    // side
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0,
  ];

  const indicies = [
    //FACE 1
    0, 1, 2,
    2, 3, 0,
    // FACE 2
    4, 5, 6,
    6, 7, 4,
    // FACE 3
    8, 9, 10,
    10, 11, 8,
    // FACE 4
    12, 13, 14,
    14, 15, 12,
    // FACE 5
    16, 17, 18,
    18, 19, 16,
    // FACE 6
    20, 21, 22,
    22, 23, 20,
  ]

  const normals = [
    //side
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    // side
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    // side
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    // side
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    // side
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    // side
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  ];

  const attributes = new VertexAttributes();
  attributes.addAttribute('position', 24, 3, positions);
  attributes.addIndices(indicies);
  attributes.addAttribute('normal', 24, 3, normals);
  vertexSource = `
  in vec3 position;
  in vec3 normal;

  out vec3 faceNormal;
  out vec3 albedo;

  uniform mat4 transformation;
  uniform mat4 rotation;
  uniform mat4 projection;
  uniform vec3 color;

  void main() {
    albedo = color;
    vec4 worldPosition = rotation * transformation * vec4(position, 1.0);
    faceNormal = (transformation * vec4(normal, 0.0)).xyz;
    gl_Position = projection * worldPosition;
  }
  `;

  fragmentSource = `
  in vec3 albedo;
  in vec3 faceNormal;

  out vec4 fragmentColor;

  const vec3 lightDirection = normalize(vec3(-1.0, 1.0, 1.0));

  void main() {
    vec3 normal = normalize(faceNormal);
    float liteness = max(0.5, dot(normal, lightDirection));
    fragmentColor = vec4(liteness * albedo, 1.0);
  }
  `;
  gl.clearColor(0.85, 0.85, 0.85, 1);
  shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
  vertexArray = new VertexArray(shaderProgram, attributes);
  window.addEventListener('resize', onSizeChanged);
  window.addEventListener('keydown', onKeyPress);
  xRot = 0;
  yRot = 0;
  boxes = [];
  clipSize = [-1, 1, -1, 1, 1, -1];
  await loadFile("shulker.txt");
  onSizeChanged();
}

initialize();