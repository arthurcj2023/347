import { Matrix4 } from "./Matrix";
import { Vector2, Vector3 } from "./Vector";

export class Trackball {
    
    constructor()
    {
        this.mouseSphere0 = null;
        this.previousRotation = new Matrix4();
        this.rotation = new Matrix4();
        this.dimensions = new Vector2(0, 0);
        this.history = [null, null];
        this.historyIndex = 0;
    }
    
    setViewport(width, height) {
        this.dimensions.x = width;
        this.dimensions.y = height;
    }

    pixelsToSphere(mousePixels) {
        var mouseNdcX = mousePixels.x / this.dimensions.x * 2 - 1;
        var mouseNdcY = mousePixels.y / this.dimensions.y * 2 - 1;
        var mouseNdc = new Vector2(mouseNdcX, mouseNdcY);
        var zSquared = 1 - Math.pow(mouseNdc.x, 2) - Math.pow(mouseNdc.y, 2);
        if (zSquared > 0)
        {
            return new Vector3(mouseNdc.x, mouseNdc.y, Math.pow(zSquared, 0.5))
        }
        else
        {
            return new Vector3(mouseNdc.x, mouseNdc.y, 0).normalize();
        }
    }

    start(mousePixels) {
        this.mouseSphere0 = this.pixelsToSphere(mousePixels);
    }

    drag(mousePixels, multiplier) {
        this.history[this.historyIndex] = mousePixels;
        this.historyIndex = (this.historyIndex + 1) % 2;
        var mouseSphere = this.pixelsToSphere(mousePixels);
        var dot = this.mouseSphere0.dot(mouseSphere);
        if (Math.abs(dot) < 0.9999)
        {
            var radians = Math.acos(dot) * multiplier;
            this.axis = this.mouseSphere0.cross(mouseSphere).normalize();
            var currentRotation = new Matrix4();
            currentRotation.rotate(radians * 180.0 / Math.PI, this.axis);
            this.rotation = currentRotation.multiplyMatrix(this.previousRotation);
        }
    }

    end() {
        this.previousRotation = this.rotation;
        this.mouseSphere0 = null;
        var hist0 = this.history[0];
        var hist1 = this.history[1];
        var diff = new Vector2(Math.abs(hist0.x - hist1.x), Math.abs(hist0.y - hist1.y));
        var diffLength = diff.length();
        return diffLength;
    }

    cancel() {
        this.rotation = this.previousRotation;
        this.mouseSphere0 = null;
    }

    autoRotate(speed)
    {
        var currentRotation = new Matrix4();
        currentRotation.rotate(speed, this.axis);
        this.previousRotation = currentRotation.multiplyMatrix(this.previousRotation);
        this.rotation = this.previousRotation;
    }
}