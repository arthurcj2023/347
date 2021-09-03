import { Vector2, Vector3, Vector4 } from './Vector.js';

// Author: CJ Arthur 2021

// Matrix3 class
export class Matrix3 {

    // Constructor that creates the identity matrix
    constructor() {
        this.clear();
    }

    // Resets the matrix to its identity
    clear() {
        this.v00 = 1;
        this.v01 = 0;
        this.v02 = 0;
        this.v10 = 0;
        this.v11 = 1;
        this.v12 = 0;
        this.v20 = 0;
        this.v21 = 0;
        this.v22 = 1;
    }

    // Adds two matrices together
    add(other) {
        var ret = Matrix3();
        ret.v00 = this.v00 + other.v00;
        ret.v01 = this.v01 + other.v01;
        ret.v02 = this.v02 + other.v02;
        ret.v10 = this.v10 + other.v10;
        ret.v11 = this.v11 + other.v11;
        ret.v12 = this.v12 + other.v12;
        ret.v20 = this.v20 + other.v20;
        ret.v21 = this.v21 + other.v21;
        ret.v22 = this.v22 + other.v22;
        return ret;
    }

    // Subtracts two matrices
    sub(other) {
        var ret = Matrix3();
        ret.v00 = this.v00 - other.v00;
        ret.v01 = this.v01 - other.v01;
        ret.v02 = this.v02 - other.v02;
        ret.v10 = this.v10 - other.v10;
        ret.v11 = this.v11 - other.v11;
        ret.v12 = this.v12 - other.v12;
        ret.v20 = this.v20 - other.v20;
        ret.v21 = this.v21 - other.v21;
        ret.v22 = this.v22 - other.v22;
        return ret;
    }

    // Multiplies the entire matrix by a float value
    multiplyScalar(scalar) {
        var ret = new Matrix3();
        ret.v00 = this.v00 * scalar;
        ret.v01 = this.v01 * scalar;
        ret.v02 = this.v02 * scalar;
        ret.v10 = this.v10 * scalar;
        ret.v11 = this.v11 * scalar;
        ret.v12 = this.v12 * scalar;
        ret.v20 = this.v20 * scalar;
        ret.v21 = this.v21 * scalar;
        ret.v22 = this.v22 * scalar;
        return ret;
    }

    // Multiplies a vector by the matrix to yield a Vector3
    multiplyVector(vec) {
        var ret = Vector3();
        ret.x = (v00 * vec.x) + (this.v01 * vec.y) + (this.v02 * vec.z);
        ret.y = (v10 * this.x) + (this.v11 * vec.y) + (this.v12 * vec.z);
        ret.z = (v20 * this.x) + (this.v21 * vec.y) + (this.v22 * vec.z);
        return ret;
    }

    // Multiplies two matrices together
    multiplyMatrix3(other) {
        var ret = new Matrix3();
        ret.v00 = (this.v00 * other.v00) + (this.v01 * other.v10) + (this.v02 * other.v20);
        ret.v10 = (this.v10 * other.v00) + (this.v11 * other.v10) + (this.v12 * other.v20);
        ret.v20 = (this.v20 * other.v00) + (this.v21 * other.v10) + (this.v22 * other.v20);
        ret.v01 = (this.v00 * other.v01) + (this.v01 * other.v11) + (this.v02 * other.v21);
        ret.v11 = (this.v10 * other.v01) + (this.v11 * other.v11) + (this.v12 * other.v21);
        ret.v21 = (this.v20 * other.v01) + (this.v21 * other.v11) + (this.v22 * other.v21);
        ret.v02 = (this.v00 * other.v02) + (this.v01 * other.v12) + (this.v02 * other.v22);
        ret.v12 = (this.v10 * other.v02) + (this.v11 * other.v12) + (this.v12 * other.v22);
        ret.v22 = (this.v20 * other.v02) + (this.v21 * other.v12) + (this.v22 * other.v22);
        return ret;
    }

    // Mirrors the matrix about the v00 to v22 line
    transpose() {
        var ret = new Matrix3();
        ret.v00 = this.v00;
        ret.v10 = this.v01;
        ret.v20 = this.v02;
        ret.v01 = this.v10;
        ret.v11 = this.v11;
        ret.v21 = this.v12;
        ret.v02 = this.v20;
        ret.v12 = this.v21;
        ret.v22 = this.v22;
        return ret;
    }

    // Takes a Vector2 to translate an object
    translate(translation) {
        this.clear();
        this.v02 = translation.x;
        this.v12 = translation.y;
    }

    // Takes a degree rotation and turns it into a matrix representign the rotation
    rotate(rotation) {
        this.clear();
        var radians = rotation * (Math.PI / 180);
        this.v00 = Math.cos(radians);
        this.v01 = Math.sin(radians);
        this.v10 = 0 - this.v01;
        this.v11 = this.v00;
    }

    // Takes a scalar factor and creates a matrix to represent the scaling
    scale(scalar) {
        this.clear();
        this.v00 = scalar;
        this.v11 = scalar;
    }

}

// Matrix4 class
export class Matrix4 {

    //Constructor that creates a Matrix4 and sets it to the identity matrix
    constructor() {
        this.clear();
    }

    toBuffer() {
        var floatArray = new Float32Array(16);
        floatArray[0] = this.v00;
        floatArray[1] = this.v10;
        floatArray[2] = this.v20;
        floatArray[3] = this.v30;
        floatArray[4] = this.v01;
        floatArray[5] = this.v11;
        floatArray[6] = this.v21;
        floatArray[7] = this.v31;
        floatArray[8] = this.v02;
        floatArray[9] = this.v12;
        floatArray[10] = this.v22;
        floatArray[11] = this.v32;
        floatArray[12] = this.v03;
        floatArray[13] = this.v13;
        floatArray[14] = this.v23;
        floatArray[15] = this.v33;
        return floatArray;
    }


    // Sets the identity matrix
    clear() {
        this.v00 = 1;
        this.v01 = 0;
        this.v02 = 0;
        this.v03 = 0;
        this.v10 = 0;
        this.v11 = 1;
        this.v12 = 0;
        this.v13 = 0;
        this.v20 = 0;
        this.v21 = 0;
        this.v22 = 1;
        this.v23 = 0;
        this.v30 = 0;
        this.v31 = 0;
        this.v32 = 0;
        this.v33 = 1;
    }

    // Adds two matrices together
    add(other) {
        var ret = new Matrix4();
        ret.v00 = this.v00 + other.v00;
        ret.v10 = this.v10 + other.v10;
        ret.v20 = this.v20 + other.v20;
        ret.v30 = this.v30 + other.v30;
        ret.v01 = this.v01 + other.v01;
        ret.v11 = this.v11 + other.v11;
        ret.v21 = this.v21 + other.v21;
        ret.v31 = this.v31 + other.v31;
        ret.v02 = this.v02 + other.v02;
        ret.v12 = this.v12 + other.v12;
        ret.v22 = this.v22 + other.v22;
        ret.v32 = this.v32 + other.v32;
        ret.v03 = this.v03 + other.v03;
        ret.v13 = this.v13 + other.v13;
        ret.v23 = this.v23 + other.v23;
        ret.v33 = this.v33 + other.v33;
        return ret;
    }

    // Subtracts two matrices
    sub(other) {
        var ret = new Matrix4();
        ret.v00 = this.v00 - other.v00;
        ret.v10 = this.v10 - other.v10;
        ret.v20 = this.v20 - other.v20;
        ret.v30 = this.v30 - other.v30;
        ret.v01 = this.v01 - other.v01;
        ret.v11 = this.v11 - other.v11;
        ret.v21 = this.v21 - other.v21;
        ret.v31 = this.v31 - other.v31;
        ret.v02 = this.v02 - other.v02;
        ret.v12 = this.v12 - other.v12;
        ret.v22 = this.v22 - other.v22;
        ret.v32 = this.v32 - other.v32;
        ret.v03 = this.v03 - other.v03;
        ret.v13 = this.v13 - other.v13;
        ret.v23 = this.v23 - other.v23;
        ret.v33 = this.v33 - other.v33;
        return ret;
    }

    // Multiplies the matrix by a scalar
    multiplyScalar(scalar) {
        var ret = new Matrix4();
        ret.v00 = this.v00 * scalar;
        ret.v01 = this.v01 * scalar;
        ret.v02 = this.v02 * scalar;
        ret.v03 = this.v03 * scalar;
        ret.v10 = this.v10 * scalar;
        ret.v11 = this.v11 * scalar;
        ret.v12 = this.v12 * scalar;
        ret.v13 = this.v13 * scalar;
        ret.v20 = this.v20 * scalar;
        ret.v21 = this.v21 * scalar;
        ret.v22 = this.v22 * scalar;
        ret.v23 = this.v23 * scalar;
        ret.v30 = this.v30 * scalar;
        ret.v31 = this.v31 * scalar;
        ret.v32 = this.v32 * scalar;
        ret.v33 = this.v33 * scalar;
        return ret;
    }

    // Multiplies the matrix by a vector storing the result in a Vector4
    multiplyVector(vec) {
        var ret = new Vector4();
        ret.x = (this.v00 * vec.x) + (this.v01 * vec.y) + (this.v02 * vec.z) + (this.v03 * vec.w);
        ret.y = (this.v10 * vec.x) + (this.v11 * vec.y) + (this.v12 * vec.z) + (this.v13 * vec.w);
        ret.z = (this.v20 * vec.x) + (this.v21 * vec.y) + (this.v22 * vec.z) + (this.v23 * vec.w);
        ret.z = (this.v30 * vec.x) + (this.v31 * vec.y) + (this.v32 * vec.z) + (this.v33 * vec.w);
        return ret;
    }

    // Multiplies two matrices
    multiplyMatrix(other) {
        var ret = new Matrix4();
        ret.v00 = (this.v00 * other.v00) + (this.v01 * other.v10) + (this.v02 * other.v20) + (this.v03 * other.v30);
        ret.v10 = (this.v10 * other.v00) + (this.v11 * other.v10) + (this.v12 * other.v20) + (this.v13 * other.v30);
        ret.v20 = (this.v20 * other.v00) + (this.v21 * other.v10) + (this.v22 * other.v20) + (this.v23 * other.v30);
        ret.v30 = (this.v30 * other.v00) + (this.v31 * other.v10) + (this.v32 * other.v20) + (this.v33 * other.v30);
        ret.v01 = (this.v00 * other.v01) + (this.v01 * other.v11) + (this.v02 * other.v21) + (this.v03 * other.v31);
        ret.v11 = (this.v10 * other.v01) + (this.v11 * other.v11) + (this.v12 * other.v21) + (this.v13 * other.v31);
        ret.v21 = (this.v20 * other.v01) + (this.v21 * other.v11) + (this.v22 * other.v21) + (this.v23 * other.v31);
        ret.v31 = (this.v30 * other.v01) + (this.v31 * other.v11) + (this.v32 * other.v21) + (this.v33 * other.v31);
        ret.v02 = (this.v00 * other.v02) + (this.v01 * other.v12) + (this.v02 * other.v22) + (this.v03 * other.v32);
        ret.v12 = (this.v10 * other.v02) + (this.v11 * other.v12) + (this.v12 * other.v22) + (this.v13 * other.v32);
        ret.v22 = (this.v20 * other.v02) + (this.v21 * other.v12) + (this.v22 * other.v22) + (this.v23 * other.v32);
        ret.v32 = (this.v30 * other.v02) + (this.v31 * other.v12) + (this.v32 * other.v22) + (this.v33 * other.v32);
        ret.v03 = (this.v00 * other.v03) + (this.v01 * other.v13) + (this.v02 * other.v23) + (this.v03 * other.v33);
        ret.v13 = (this.v10 * other.v03) + (this.v11 * other.v13) + (this.v12 * other.v23) + (this.v13 * other.v33);
        ret.v23 = (this.v20 * other.v03) + (this.v21 * other.v13) + (this.v22 * other.v23) + (this.v23 * other.v33);
        ret.v33 = (this.v30 * other.v03) + (this.v31 * other.v13) + (this.v32 * other.v23) + (this.v33 * other.v33);
        return ret;
    }

    transpose() {
        var ret = new Matrix4();
        ret.v00 = this.v00;
        ret.v10 = this.v01;
        ret.v20 = this.v02;
        ret.v30 = this.v03;
        ret.v01 = this.v10;
        ret.v11 = this.v11;
        ret.v21 = this.v12;
        ret.v31 = this.v13;
        ret.v02 = this.v20;
        ret.v12 = this.v21;
        ret.v22 = this.v22;
        ret.v32 = this.v23;
        ret.v03 = this.v30;
        ret.v13 = this.v31;
        ret.v23 = this.v32;
        ret.v33 = this.v33;
        this.v00 = ret.v00;
        this.v01 = ret.v01;
        this.v02 = ret.v02;
        this.v03 = ret.v03;
        this.v10 = ret.v10;
        this.v11 = ret.v11;
        this.v12 = ret.v12;
        this.v13 = ret.v13;
        this.v20 = ret.v20;
        this.v21 = ret.v21;
        this.v22 = ret.v22;
        this.v23 = ret.v23;
        this.v30 = ret.v30;
        this.v31 = ret.v31;
        this.v32 = ret.v32;
        this.v33 = ret.v33;
        return ret;
    }

    translate(translation) {
        this.clear();
        this.v03 = translation.x;
        this.v13 = translation.y;
        this.v23 = translation.z;
    }

    rotate(rotation, axis) {
        this.clear();
        var radians = rotation * (Math.PI / 180);
        var cosine = Math.cos(radians);
        var sine = Math.sin(radians);
        var vec = new Vector3(axis.x, axis.y, axis.z);
        if (vec.length() != 1) {
            vec = vec.normalize();
        }
        this.v00 = vec.x * vec.x * (1.0 - cosine) + cosine;
        this.v10 = vec.y * vec.x * (1.0 - cosine) + vec.z * sine;
        this.v20 = vec.x * vec.z * (1.0 - cosine) - vec.y * sine;
        this.v01 = vec.x * vec.y * (1.0 - cosine) - vec.z * sine;
        this.v11 = vec.y * vec.y * (1.0 - cosine) + cosine;
        this.v21 = vec.y * vec.z * (1.0 - cosine) + vec.x * sine;
        this.v02 = vec.x * vec.z * (1.0 - cosine) + vec.y * sine;
        this.v12 = vec.y * vec.z * (1.0 - cosine) - vec.x * sine;
        this.v22 = vec.z * vec.z * (1.0 - cosine) + cosine;
    }

    scale(scalar) {
        this.clear();
        this.v00 = scalar.x;
        this.v11 = scalar.y;
        this.v22 = scalar.z;
    }

    createModelMatrix4(translation, rotationX, rotationY, rotationZ, scalar) {
        var ret = new Matrix4();
        var moveMat = new Matrix4();
        var xRotMat = new Matrix4();
        var yRotMat = new Matrix4();
        var zRotMat = new Matrix4();
        var scaleMat = new Matrix4();
        moveMat.translate(translation);
        xRotMat.rotate(rotationX, new Vector3(1, 0, 0));
        yRotMat.rotate(rotationY, new Vector3(0, 1, 0));
        zRotMat.rotate(rotationZ, new Vector3(0, 0, 1));
        scaleMat.scale(scalar);
        ret = moveMat.multiplyMatrix(xRotMat);
        ret = ret.multiplyMatrix(yRotMat);
        ret = ret.multiplyMatrix(zRotMat);
        ret = ret.multiplyMatrix(scaleMat);
        return ret;
    }

    createOrthoProjectionMatrix4(aspectRatio, left, right, near, far, top, bottom) {
        var ret = new Matrix4();
        var l = left;
        var r = right;
        var t = top;
        var b = bottom;
        var n = near;
        var f = far;
        if (aspectRatio < 1) {
            t = r / aspectRatio;
            b = -t;
        }
        else {
            r = t * aspectRatio;
            l = -r;
        }
        l *= 1.42;
        r *= 1.42;
        t *= 1.42;
        b *= 1.42;
        n *= 1.42;
        f *= 1.42;
        ret.v00 = 2 / (r - l);
        ret.v01 = 0;
        ret.v02 = 0;
        ret.v03 = - ((r + l) / (r - l));
        ret.v10 = 0;
        ret.v11 = 2 / (t - b);
        ret.v12 = 0;
        ret.v13 = - ((t + b) / (t - b));
        ret.v20 = 0;
        ret.v21 = 0;
        ret.v22 = 2 / (n - f);
        ret.v23 = ((n + f) / (n - f));
        ret.v30 = 0;
        ret.v31 = 0;
        ret.v32 = 0;
        ret.v33 = 1;
        return ret;
    }

}

// Create a Matrix3 to represent model transformations
export function createModelMatrix3(translation, rotation, scalar) {
    var ret = new Matrix3();
    var moveMat = new Matrix3();
    var rotMat = new Matrix3();
    var scaleMat = new Matrix3();
    moveMat.translate(translation);
    rotMat.rotate(rotation);
    scaleMat.scale(scalar);
    ret = moveMat.multiplyMatrix3(rotMat);
    ret = ret.multiplyMatrix3(scaleMat);
    return ret;
}
