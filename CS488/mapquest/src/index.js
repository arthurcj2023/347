import { VertexArray } from './VertexArray';
import { VertexAttributes } from './VertexAttributes';
import { ShaderProgram } from './ShaderProgram';
import { Vector2, Vector3 } from './Vector';
import { Matrix4 } from './Matrix';
import { Camera } from './Camera';
import { ImageUtilities, Heightmap } from './Heightmap';
const canvas = document.getElementById('canvas');
window.gl = canvas.getContext('webgl2');
const baseLightPosition = new Vector3(1000.0, 1000.0, 1000.0);

let vertexArray = [];
let textures = [];
let matricies = [];
let coinPositions = [];
let coinRotations = [];
let terrainVertexArray;
let terrainShader;
let shaderProgram;
let vertexSource;
let fragmentSource;
let projectionMatrix;
let heightmap;
let camera;
let collectSound;
let victorySound;
let victory = false;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  terrainShader.bind();
  terrainShader.setUniform3f("lightPosition", baseLightPosition.x, baseLightPosition.y, baseLightPosition.z);
  terrainShader.setUniformMatrix4("projection", projectionMatrix);
  terrainShader.setUniformMatrix4("view", camera.matrix);
  terrainVertexArray.bind();
  terrainVertexArray.drawIndexed(gl.TRIANGLES);
  terrainVertexArray.unbind();
  terrainShader.unbind();
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  shaderProgram.bind();
  shaderProgram.setUniform3f("lightPosition", baseLightPosition.x, baseLightPosition.y, baseLightPosition.z);
  shaderProgram.setUniformMatrix4("projection", projectionMatrix);
  shaderProgram.setUniformMatrix4("view", camera.matrix);
  for (var i = 0; i < vertexArray.length; i++)
  {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    vertexArray[i].bind();
    for (var j = 0; j < matricies[i].length; j++)
    {
      shaderProgram.setUniformMatrix4("model", matricies[i][j]);
      vertexArray[i].drawIndexed(gl.TRIANGLES);
    }
    vertexArray[i].unbind();
  }
  shaderProgram.unbind();
  gl.disable(gl.CULL_FACE);
}

function onSizeChanged() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  projectionMatrix = new Matrix4().createPerspectiveProjectionMatrix4(canvas.width / canvas.height, 110, 0.1, 1000);
  render();
}

function generateRandomTransforms(num, height, scale, isCoin) {
  var models = [];
  for (var i = 0; i < num; i++)
  {
    var x = Math.random() * 200 + 32;
    var z = Math.random() * 200 + 32;
    var rot = Math.random() * 360;
    var trans = new Matrix4();
    trans.translate(new Vector3(x, height + heightmap.lerp(x, z), z));
    var rotMat = new Matrix4();
    rotMat.rotate(rot, new Vector3(0, 1, 0));
    var scaleMat = new Matrix4();
    scaleMat.scale(new Vector3(scale, scale, scale));
    models.push(trans.multiplyMatrix(rotMat).multiplyMatrix(scaleMat));
    if (isCoin)
    {
      coinPositions.push([x, z]);
      coinRotations.push(rot);
    }
  }
  matricies.push(models);
}

function checkCollision(camX, camZ, coinX, coinZ, coinIndex)
{
  var dist = new Vector2(camX, camZ).sub(new Vector2(coinX, coinZ)).length();
  if (dist <= 1.5)
  {
    collectSound.play();
    matricies[2].splice(coinIndex, 1);
    coinPositions.splice(coinIndex, 1);
    coinRotations.splice(coinIndex, 1);
    console.log(coinPositions.length);
    if (coinPositions.length == 0 && !victory)
    {
      victory = true;
      victorySound.play();
    }
  }
}

async function loadObj(filename) {
  await fetch(filename).then(response => response.text()).then(responseText => {
    const positionsVectors = [0, 0, 0,];
    const normalsVectors = [0, 0, 0,];
    const texturesVectors = [0, 0,];
    const positionsIndicies = [0,];
    const normalsIndicies = [0,];
    const texturesIndicies = [0,];
    const positions = [];
    const normals = [];
    const textures = [];
    const indicies = [];
    var lines = responseText.split("\n");
    for (var i = 0; i < lines.length; i++) {

      if (lines[i].startsWith("vn")) {
        var coords = lines[i].split(" ");
        normalsVectors.push(parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
      }
      else if (lines[i].startsWith('vt'))
      {
        var coords = lines[i].split(" ");
        texturesVectors.push(parseFloat(coords[1]), parseFloat(coords[2]));
      }
      else if (lines[i].startsWith("v")) {
        var coords = lines[i].split(" ");
        positionsVectors.push(parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]));
      }
      else if (lines[i].startsWith("f")) {
        var points = lines[i].split(" ");
        var vertexData = points[1].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
        texturesIndicies.push(parseInt(vertexData[1]));
        vertexData = points[2].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
        texturesIndicies.push(parseInt(vertexData[1]));
        vertexData = points[3].split("/");
        positionsIndicies.push(parseInt(vertexData[0]));
        normalsIndicies.push(parseInt(vertexData[2]));
        texturesIndicies.push(parseInt(vertexData[1]));
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
      toAddx = texturesVectors[texturesIndicies[i] * 2 + 0];
      toAddy = texturesVectors[texturesIndicies[i] * 2 + 1];
      textures.push(toAddx, 1 - toAddy);
      indicies.push(i - 1);
    }
    const attributes = new VertexAttributes();
    attributes.addAttribute('position', positions.length / 3, 3, positions);
    attributes.addIndices(indicies);
    attributes.addAttribute('normal', normals.length / 3, 3, normals);
    attributes.addAttribute('textureCoords', textures.length / 2, 2, textures);
    vertexArray.push(new VertexArray(shaderProgram, attributes));
  });
}

async function loadHeightmap(url) {
  const image = new Image();
  image.src = url;
  await image.decode();
  const {grays, width, height} = ImageUtilities.htmlImageToGrays(image);
  heightmap = new Heightmap(width, height, grays);
}

async function loadTexture(url, textureUnit = gl.TEXTURE0) {
  const image = new Image();
  image.src = url;
  await image.decode();

  gl.activeTexture(textureUnit);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);

  return texture;
}

async function initialize() {
  collectSound = new Audio("sound.wav");
  victorySound = new Audio("victory.wav");
  await loadHeightmap("map.png");
  camera = new Camera(heightmap.x / 2, heightmap.z / 2, heightmap);
  vertexSource = `
  in vec3 position;
  in vec3 normal;
  in vec2 textureCoords;

  uniform mat4 view;
  uniform mat4 model;
  uniform mat4 projection;

  out vec3 fnormal;
  out vec3 positionEye;
  out vec2 ftextureCoords;

  void main() {
    gl_Position = projection * view * model * vec4(position, 1.0);
    fnormal = (model * vec4(normal, 0.0)).xyz;
    positionEye = (view * model * vec4(position, 1.0)).xyz;
    ftextureCoords = textureCoords;
  }
  `;

  fragmentSource = `
  const float ambientWeight = 0.5;
  const float shininess = 10000000000000.0;
  const vec3 lightColor = vec3(1.0);
  
  in vec3 fnormal;
  in vec3 positionEye;
  in vec2 ftextureCoords;

  uniform vec3 lightPosition;
  uniform sampler2D image;

  out vec4 fragmentColor;

  void main() {
    vec3 albedo = texture(image, ftextureCoords).rgb;
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

  var terrainVertex = `
  in vec3 position;
  in vec3 normal;

  out vec3 fnormal;
  out vec3 positionEye;

  uniform mat4 view;
  uniform mat4 projection;

  void main() {
    fnormal = normal;
    positionEye = (view * vec4(position, 1.0)).xyz;
    gl_Position = projection * view * vec4 (position, 1.0);
  }
  `;

  var terrainFragment = `
  const float ambientWeight = 0.3;
  const vec3 lightColor = vec3(1.0);
  const vec3 albedo = vec3(0.0, 1.0, 0.0);

  in vec3 fnormal;
  in vec3 positionEye;

  out vec4 fragmentColor;

  uniform vec3 lightPosition;

  void main() {
    vec3 lightVector = normalize(lightPosition - positionEye);
    vec3 normal = normalize(fnormal);
    float litness = max(0.0, dot(normal, lightVector));
    vec3 diffuse = litness * lightColor * (1.0 - ambientWeight);
    vec3 ambient = lightColor * ambientWeight;
    vec3 rgb = (ambient + diffuse) * albedo;
    fragmentColor = vec4 (rgb, 1.0);
  }
  `;
  gl.clearColor(53/128, 81/128, 92/128, 1);
  terrainShader = new ShaderProgram(terrainVertex, terrainFragment);
  const attributes = new VertexAttributes();
  attributes.addAttribute('position', heightmap.positions.length / 3, 3, heightmap.positions);
  attributes.addIndices(heightmap.faces);
  attributes.addAttribute('normal', heightmap.normals.length / 3, 3, heightmap.normals);
  terrainVertexArray = new VertexArray(terrainShader, attributes);
  shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
  await loadObj("stall.obj");
  await loadObj("crate.obj");
  await loadObj("coin.obj");
  textures.push(await loadTexture("stall.png"));
  textures.push(await loadTexture("crate.png"));
  textures.push(await loadTexture("coin.png"));
  generateRandomTransforms(20, 0, 0.75, false);
  generateRandomTransforms(50, 0.75, 0.01, false);
  generateRandomTransforms(100, 1, 1, true);
  //set up hitbox3es and rotation
  window.addEventListener('resize', onSizeChanged);
  window.addEventListener('keydown', moveCamera);
  window.addEventListener('mousedown', lockMouse);
  window.addEventListener('mousemove', rotateCamera);
  onSizeChanged();
  requestAnimationFrame(rotateCoins);
}

function rotateCoins()
{
  for (var i = 0; i < coinRotations.length; i++)
  {
    coinRotations[i] += 0.5;
    var trans = new Matrix4();
    trans.translate(new Vector3(coinPositions[i][0], 1 + heightmap.lerp(coinPositions[i][0], coinPositions[i][1]), coinPositions[i][1]));
    var rotMat = new Matrix4();
    rotMat.rotate(coinRotations[i], new Vector3(0, 1, 0));
    var scaleMat = new Matrix4();
    scaleMat.scale(new Vector3(1, 1, 1));
    matricies[2][i] = trans.multiplyMatrix(rotMat).multiplyMatrix(scaleMat);
  }
  render();
  requestAnimationFrame(rotateCoins);
}

function moveCamera(event)
{
  var fb = 0;
  var lr = 0;
  if (event.key === 'a') {
    lr -= 0.5;
  } 
  if (event.key === 'd') {
    lr += 0.5;
  }
  if (event.key === 'w') {
    fb -= 0.5;
  }
  if (event.key === 's') {
    fb += 0.5;
  }
  camera.updatePosition(fb, lr);
  for (var i = 0; i < matricies[2].length; i++)
  {
    checkCollision(camera.position.x, camera.position.z, coinPositions[i][0], coinPositions[i][1], i);
  }
  render();
}

function lockMouse(){
  document.body.requestPointerLock();
}

function rotateCamera(event){
  if (document.pointerLockElement) {
    camera.updateRotation(event.movementY * 0.1, event.movementX * 0.1);
  }
  render();
}
initialize();