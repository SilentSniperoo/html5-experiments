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
            this.move(event);
            this.emit('mousemove');
        });

        window.addEventListener('mousedown', (event) => {
            this.press(event, true);
            this.emit('mousedown');
        });

        window.addEventListener('mouseup', (event) => {
            this.press(event, false);
            this.emit('mouseup');
        });

        window.addEventListener('scroll', (event) => {
            this.wheel = new Vec2(event.deltaX, event.deltaY);
            // TODO: May want to use `event.deltaMode`
            this.emit('scroll');
        });
    }

    move(event) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        this.point = new Vec2(x, y);
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
