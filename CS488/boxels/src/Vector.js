// Author: CJ Arthur 2021

// Vector2 class
export class Vector2
{

    // Constructor from x and y
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    // Adds two vwectors and returns the result
    add(other)
    {
        return Vector2(this.x + other.x, this.y + other.y);
    }

    // Subtracts two vectors and returns the result
    sub(other)
    {
        return Vector2(this.x - other.x, this.y - other.y);
    }

    // Determines dot product of two vectors
    dot(other)
    {
        return (this.x * other.x) + (this.y * other.y);
    }

    // Scales vector by a scalar
    scale(scalar)
    {
        return Vector2(this.x * scalar, this.y * scalar);
    }

    // Gets magnitude of a vector
    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    // Returns a unit vector from the given vector
    normalize()  
    {
        return this.scale(1 / this.length());
    }
}

// Vector3 class
export class Vector3 
{
    // Constructor from x, y, and z
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Adds two vectors
    add(other)
    {
        return Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    // Subtracts two vectors
    sub(other)
    {
        return Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    // Determines the dot product of two vectors
    dot(other)
    {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
    }

    // Determines the cross product of two vectors
    cross(other)
    {
        var x = (this.y * other.z) - (this.z * other.y);
        var y = (this.z * other.x) - (this.x * other.z);
        var z = (this.x * other.y) - (this.y * other.x);
        return Vector3(x, y, z);
    }

    // Scales a vector by a scalar
    scale(scalar)
    {
        return Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    // Gets magnitude of a vector
    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    // Returns a unit vector from the given vector
    normalize()
    {
        return this.scale(1 / this.length());
    }
}

// Vector4 class
export class Vector4
{
    // Constructor from x, y, z, and w
    constructor(x = 0, y = 0, z = 0, w = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    // Adds two vectors
    add(other)
    {
        return Vector4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);
    }

    // Subtracts two vectors
    sub(other)
    {
        return Vector4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);
    }

    // Determines the dot product of two vectors
    dot(other)
    {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z) + (this.w * other.w);
    }

    // Scales a vector by a scalar
    scale(scalar)
    {
        return Vector4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }

    // Gets magnitude of a vector
    length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }

    // Returns a unit vector from the given vector
    normalize()
    {
        return this.scale(1 / this.length());
    }
}

// Color class
export class Color
{

    // Constructor from r, g, b, and a
    constructor(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    // Transforms color to grayscale
    grayscale()
    {
        return Color(this.r * 0.3, this.g * 0.59, this.b * 0.11, this.a);
    }


}