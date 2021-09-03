import { Vector3 } from "./Vector";

export class ImageUtilities {
    static htmlImageToGrays(image) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        const pixels = context.getImageData(0, 0, image.width, image.height);
        const grays = new Array(image.width * image.height);
        for (let i = 0; i < image.width * image.height; ++i) {
            grays[i] = pixels.data[i * 4] * 10 / 255;
        }
        return { grays, width: image.width, height: image.height };
    }
}

export class Heightmap {
    constructor(x, z, heights) {
        this.x = x;
        this.z = z;
        this.heights = heights;
        this.toTriangleMesh();
    }

    get(x, z) {
        return this.heights[z * this.z + x];
    }

    set(x, z, height) {
        this.heights[z * this.z + x] = height;
    }

    lerp(x, z) {
        var floorX = Math.floor(x);
        var floorZ = Math.floor(z);
        var fractionX = x - floorX;
        var fractionZ = z - floorZ;
        var nearHeight = (1 - fractionX) * this.get(floorX, floorZ) + fractionX * this.get(floorX + 1, floorZ);
        var farHeight = (1 - fractionX) * this.get(floorX, floorZ + 1) + fractionX * this.get(floorX + 1, floorZ + 1);
        var y = (1 - fractionZ) * nearHeight + fractionZ * farHeight;
        return y;
    }

    toTriangleMesh() {
        this.positions = [];
        for (var i = 0; i < this.z; i++)
        {
            for (var j = 0; j < this.x; j++)
            {
                var y = this.get(j, i);
                this.positions.push(j, y, i);
            }
        }
        

        this.faces = [];
        for (var i = 0; i < this.z - 1; i++)
        {
            var nextZ = i + 1;
            for (var j = 0; j < this.x - 1; j++)
            {
                var nextX = j + 1;
                this.faces.push(
                    i * this.x + j,
                    i * this.x + nextX,
                    nextZ * this.x + j,
                );
        
                this.faces.push(
                    i * this.x + nextX,
                    nextZ * this.x + nextX,
                    nextZ * this.x + j
                );
            }
        }

        this.normals = new Array(this.positions.length);
        for (var i = 0; i < this.normals.length; i++)
        {
            this.normals[i] = 0;
        }
        for (var i = 0; i < this.faces.length / 3; i++)
        {
            var face = new Vector3(this.faces[i * 3 + 0], this.faces[i * 3 + 1], this.faces[i * 3 + 2]);
            var a = new Vector3(this.positions[face.x * 3 + 0], this.positions[face.x * 3 + 1], this.positions[face.x * 3 + 2]);
            var b = new Vector3(this.positions[face.y * 3 + 0], this.positions[face.y * 3 + 1], this.positions[face.y * 3 + 2]);
            var c = new Vector3(this.positions[face.z * 3 + 0], this.positions[face.z * 3 + 1], this.positions[face.z * 3 + 2]);
            var v = b.sub(a);
            var w = c.sub(a);
            var faceNormal = w.cross(v).normalize();
            this.normals[face.x * 3 + 0] += faceNormal.x;
            this.normals[face.x * 3 + 1] += faceNormal.y;
            this.normals[face.x * 3 + 2] += faceNormal.z;

            this.normals[face.y * 3 + 0] += faceNormal.x;
            this.normals[face.y * 3 + 1] += faceNormal.y;
            this.normals[face.y * 3 + 2] += faceNormal.z;

            this.normals[face.z * 3 + 0] += faceNormal.x;
            this.normals[face.z * 3 + 1] += faceNormal.y;
            this.normals[face.z * 3 + 2] += faceNormal.z;
        }
        for (var i = 0; i < this.normals.length / 3; i++)
        {
            var normal = new Vector3(this.normals[i * 3 + 0], this.normals[i * 3 + 1], this.normals[i * 3 + 2]).normalize();
            this.normals[i * 3 + 0] = normal.x;
            this.normals[i * 3 + 1] = normal.y;
            this.normals[i * 3 + 2] = normal.z;
        }

    }
}