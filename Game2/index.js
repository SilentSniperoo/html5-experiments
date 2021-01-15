const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    added(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    subtracted(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    multiplied(other) {
        return new Vec2(this.x * other, this.y * other);
    }
    divided(other) {
        return new Vec2(this.x / other, this.y / other);
    }
    get sqLength() {
        return this.x * this.x + this.y * this.y;
    }
    get length() {
        return Math.sqrt(this.sqLength);
    }
    get normalized() {
        return (this.x != 0 || this.y != 0)
            ? this.divided(this.length)
            : this;
    }
}

class Screen {
    constructor(canvas) {
        this.canvas = canvas;

        window.addEventListener('resize', (event) => {
            console.log('resize: ' + event);
            this.setupCanvas();
        });

        this.setupCanvas();
    }

    setupCanvas() {
        this.size = new Vec2(innerWidth, innerHeight);
        this.center = this.size.divided(2);
        this.canvas.width = this.size.x;
        this.canvas.height = this.size.y;
    }
}

class MouseState {
    constructor(buttonsBitField, point, wheel) {
        this.buttonsBitField = buttonsBitField;
        this.point = point;
        this.wheel = wheel;
    }

    setButtons(primary, secondary, auxiliary, back, forward) {
        this.buttonsBitField =
            primary   ? 1 : 0 |
            secondary ? 2 : 0 |
            auxiliary ? 4 : 0 |
            back      ? 8 : 0 |
            forward   ? 16 : 0;
    }
    setButton(id, down) {
        if (down) {
            this.buttonsBitField = this.buttonsBitField | id;
        }
        else {
            this.buttonsBitField = this.buttonsBitField & id;
        }
    }

    get none() {
        return this.buttonsBitField == 0;
    }
    get any() {
        return this.buttonsBitField != 0;
    }
    get primary() { // Left
        return this.buttonsBitField & 1;
    }
    get secondary() { // Right
        return this.buttonsBitField & 2;
    }
    get auxiliary() { // Middle
        return this.buttonsBitField & 4;
    }
    get back() {
        return this.buttonsBitField & 8;
    }
    get forward() {
        return this.buttonsBitField & 16;
    }
}

class MouseClick {
    constructor(startState) {
        this.path = [ startState ];
    }

    get startState() {
        return this.path[0];
    }
    get endState() {
        return this.path[this.path.length - 1];
    }
    get startPoint() {
        return this.path[0].point;
    }
    get endPoint() {
        return this.path[this.path.length - 1].point;
    }
}

class Mouse extends MouseState {
    constructor() {
        super(0, new Vec2(0, 0), new Vec2(0, 0));
        this.click = null;
        this.listeners = {};

        window.addEventListener('mousemove', (event) => {
            console.log('mousemove: ' + event);
            this.move(event);
            this.emit('mousemove');
        });

        window.addEventListener('mousedown', (event) => {
            console.log('mousedown: ' + event);
            this.press(event, true);
            this.emit('mousedown');
        });

        window.addEventListener('mouseup', (event) => {
            console.log('mouseup: ' + event);
            this.press(event, false);
            this.emit('mouseup');
        });

        window.addEventListener('scroll', (event) => {
            console.log('scroll: ' + event);
            this.wheel = new Vec2(event.deltaX, event.deltaY);
            // TODO: May want to use `event.deltaMode`
            this.emit('scroll');
        });
    }

    move(event) {
        this.point = new Vec2(event.clientX, event.clientY);
        if (this.click) {
            this.click.path.push(this); // Update the current click gesture
        }
    }

    press(event, down) {
        if ('buttons' in event) { // Older browsers don't support the bit field
            this.buttonsBitField = event.buttons;
        }
        else if (event.which == 3) { // Secondary button
            this.setButton(2, down); // Secondary bit
        }
        else if (event.which == 2) { // Auxiliary button
            this.setButton(4, down); // Auxiliary bit
        }
        else {
            this.setButton(event.which, down);
        }

        this.move(event); // Includes appending to an existing click

        if (this.none) { // If no buttons
            this.click = null; // End the click
        }
        else if (!this.click) { // If any buttons, but no click
            this.click = new MouseClick(this); // Start one
        }
    }

    listen(name, object, callback) {
        if (!(name in this.listeners)) {
            this.listeners[name] = {}
        }
        this.listeners[name][object] = callback;
    }

    emit(name) {
        if (name in this.listeners) {
            for (const key in this.listeners[name]) {
                this.listeners[name][key](this)
            }
        }
    }
}

class Keyboard {
    constructor() {
        this.keys = {};

        window.addEventListener('keydown', (event) => {
            console.log('keydown: ' + event);
            this.keys[event.key] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            console.log('keyup: ' + event);
            this.keys[event.key] = false;
        });
    }

    isDown(key) {
        return key in this.keys && this.keys[key];
    }
}

const screen = new Screen(canvas);
const mouse = new Mouse();
const keyboard = new Keyboard();

class Entity {
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;
    }

    bind() {
        this.onBind();
    }

    onBind() {
        console.log("'onBind' was not overridden")
    }

    tick() {
        this.onTick();
    }

    onTick() {
        console.log("'onTick' was not overridden")
    }

    draw() {
        this.onDraw();
    }

    onDraw() {
        console.log("'onDraw' was not overridden")
    }
}

const entities = [];

class Player extends Entity {
    constructor(pos, color, radius) {
        super(pos, color);
        this.radius = radius;
        this.velocity = new Vec2(0, 0);
        this.target = null;
        this.pursuit = 0;
    }

    onTick() {
        if (mouse.any) {
            this.target = mouse.point;
        }
        else {
            this.velocity = new Vec2(0, 0);
            if (keyboard.isDown('w')) {
                this.velocity.y -= 1;
                this.target = null;
            }
            if (keyboard.isDown('s')) {
                this.velocity.y += 1;
                this.target = null;
            }
            if (keyboard.isDown('d')) {
                this.velocity.x += 1;
                this.target = null;
            }
            if (keyboard.isDown('a')) {
                this.velocity.x -= 1;
                this.target = null;
            }
            this.velocity = this.velocity.normalized;
        }

        if (this.target) {
            this.velocity = this.target.subtracted(this.pos);
            if (this.pursuit != 0) {
                this.velocity = this.velocity.multiplied(this.pursuit);
            }
        }
        this.pos = this.pos.added(this.velocity);
    }

    onDraw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const player = new Player(screen.center, 'blue', 30);
entities.push(player);

function update() {
    ctx.clearRect(0, 0, screen.size.x, screen.size.y);
    for (var i = 0; i < entities.length; ++i) {
        entities[i].tick();
    }
    for (var i = 0; i < entities.length; ++i) {
        entities[i].draw();
    }
}

for (var i = 0; i < entities.length; ++i) {
    entities[i].bind();
}

function animate() {
    requestAnimationFrame(animate);
    update();
}
animate();