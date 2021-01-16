class Screen {
    constructor(canvas) {
        this.canvas = canvas;
        this.debug = false;

        window.addEventListener('resize', (event) => {
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

    draw() {
        if (this.debug) {
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(0, 0);
            ctx.lineTo(this.size.x - 1, 0);
            ctx.lineTo(this.size.x - 1, this.size.y - 1);
            ctx.lineTo(0, this.size.y - 1);
            ctx.lineTo(0, 0);
            ctx.lineTo(this.size.x - 1, this.size.y - 1);
            ctx.moveTo(this.size.x - 1, 0);
            ctx.lineTo(0, this.size.y - 1);
            ctx.stroke();
        }
    }
}
