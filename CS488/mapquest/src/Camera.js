import { Matrix3, Matrix4 } from './Matrix.js';
import { Vector3, Vector4 } from './Vector.js';
import { Heightmap } from './Heightmap.js';

export class Camera {

    constructor(x, z, heightmap)
    {
        this.heightmap = heightmap;
        this.eyeLevel = 2;
        this.position = new Vector3(x, this.eyeLevel, z);
        this.pitch = 0;
        this.yaw = 0;
        this.matrix = new Matrix4();
        this.pitchMat = new Matrix4();
        this.yawMat = new Matrix4();
        this.updateMatrix();
    }

    updatePosition(forward, strafe)
    {
        var yawMat3 = new Matrix3();
        yawMat3.rotate(-this.yaw);
        var mov3 = new Vector3(strafe, forward, 0);
        mov3 = yawMat3.multiplyVector(mov3);
        this.position.x = this.position.x + mov3.x;
        this.position.z = this.position.z + mov3.y;
        this.updateMatrix();
    }

    updateRotation(pitch, yaw)
    {
        this.pitch += pitch;
        this.yaw += yaw;
        if (this.pitch > 90)
        {
            this.pitch = 90;
        }
        if (this.pitch < -90)
        {
            this.pitch = -90;
        }
        this.pitchMat.rotate(this.pitch, new Vector3(1, 0, 0));
        this.yawMat.rotate(this.yaw, new Vector3(0, 1, 0));
        this.updateMatrix();
    }

    updateHeight() {
        if (this.position.x < 1) this.position.x = 1;
        if (this.position.z < 1) this.position.z = 1;
        if (this.position.x > this.heightmap.x - 2) this.position.x = this.heightmap.x - 2;
        if (this.position.z > this.heightmap.z - 2) this.position.z = this.heightmap.z - 2;
        this.position.y = this.heightmap.lerp(this.position.x, this.position.z) + this.eyeLevel;
    }

    updateMatrix()
    {
        this.updateHeight();
        this.matrix.translate(new Vector3(-this.position.x, -this.position.y, -this.position.z));
        this.matrix = this.pitchMat.multiplyMatrix(this.yawMat).multiplyMatrix(this.matrix);
    }

}