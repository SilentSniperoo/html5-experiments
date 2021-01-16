class Keyboard {
    constructor() {
        this.keys = {};

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    isDown(key) {
        return key in this.keys && this.keys[key];
    }
}
