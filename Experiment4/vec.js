class BaseVec {
    constructor(components) {
        this.components = components;
    }

    clone() {
        console.log("`clone` called on `BaseVec`");
    }

    added(other) {
        var result = this.clone();
        for (var i = 0; i < this.components.length; ++i) {
            result.components[i] += other.components[i];
        }
        return result;
    }
    subtracted(other) {
        var result = this.clone();
        for (var i = 0; i < this.components.length; ++i) {
            result.components[i] -= other.components[i];
        }
        return result;
    }
    multiplied(other) {
        var result = this.clone();
        for (var i = 0; i < this.components.length; ++i) {
            result.components[i] *= other;
        }
        return result;
    }
    divided(other) {
        var result = this.clone();
        for (var i = 0; i < this.components.length; ++i) {
            result.components[i] /= other;
        }
        return result;
    }
    dot(other) {
        var sum = 0;
        for (var i = 0; i < this.components.length; ++i) {
            sum += this.components[i] * other.components[i];
        }
        return sum;
    }

    get manhattan() {
        var sum = 0;
        for (const component in this.components) {
            sum += component;
        }
        return sum;
    }
    get sqLength() {
        var sum = 0;
        for (const component in this.components) {
            sum += component * component;
        }
        return sum;
    }
    get length() {
        return Math.sqrt(this.sqLength);
    }
    get normalized() {
        return (this.manhattan == 0) ? this : this.divided(this.length);
    }
}

class Vec2 extends BaseVec {
    static Zero = new Vec2(0, 0);
    static One = new Vec2(1, 1);
    static Up = new Vec2(0, -1);
    static Down = new Vec2(0, 1);
    static Left = new Vec2(-1, 0);
    static Right = new Vec2(1, 0);

    constructor(x, y) {
        super([x, y]);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    get x() {
        return this.components[0];
    }
    set x(value) {
        this.components[0] = value;
    }
    get y() {
        return this.components[1];
    }
    set y(value) {
        this.components[1] = value;
    }
}

class Vec3 extends BaseVec {
    static Zero = new Vec2(0, 0, 0);
    static One = new Vec2(1, 1, 1);
    static Up = new Vec2(0, -1, 0);
    static Down = new Vec2(0, 1, 0);
    static Left = new Vec2(-1, 0, 0);
    static Right = new Vec2(1, 0, 0);
    static Back = new Vec2(0, 0, -1);
    static Forward = new Vec2(0, 0, 1);

    constructor(x, y, z) {
        super([x, y, z]);
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    get x() {
        return this.components[0];
    }
    set x(value) {
        this.components[0] = value;
    }
    get y() {
        return this.components[1];
    }
    set y(value) {
        this.components[1] = value;
    }
    get z() {
        return this.components[2];
    }
    set z(value) {
        this.components[2] = value;
    }
}
