const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

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

for (var i = 0; i < entities.length; ++i) {
    entities[i].bind();
}

function update() {
    ctx.clearRect(0, 0, screen.size.x, screen.size.y);
    for (var i = 0; i < entities.length; ++i) {
        entities[i].tick();
    }
    for (var i = 0; i < entities.length; ++i) {
        entities[i].draw();
    }
    screen.draw();
    screen.debug = keyboard.isDown(';');
}

function animate() {
    requestAnimationFrame(animate);
    update();
}
animate();