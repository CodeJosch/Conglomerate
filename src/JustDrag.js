/**
 * @typedef {{
 *     handle: HTMLElement|undefined,
 *     container: HTMLElement|undefined,
 * }} DraggableOptions
 */

export default class JustDrag {
    /** @type {HTMLElement} */
    #el;
    /** @type {DraggableOptions} */
    #options;
    /** @type {{up: function, down: function, move: function}} */
    #handlers = {};

    /**
     * @param {HTMLElement} el
     * @param {DraggableOptions} options
     **/
    constructor(el, options = {}) {
        this.#el = el;
        this.#options = options;
        this.#handlers = {
            down: this.#down.bind(this),
            up: this.#up.bind(this),
            move: this.#move.bind(this)
        };
        this.#install();
    }

    destroy() {
        (this.#el || this.handle).removeEventListener('pointerdown', this.#handlers.down);
    }

    #install() {
        (this.#el || this.handle).addEventListener('pointerdown', this.#handlers.down);
    }

    /**@param {PointerEvent} evt */
    #down(evt) {
        if (evt.target !== this.draggableElement) {
            return;
        }
        this.#el.style.touchAction = 'none';
        addEventListener('pointermove', this.#handlers.move);
        addEventListener('pointerup', this.#handlers.up);
        evt.preventDefault();
    };

    #up() {
        removeEventListener('pointermove', this.#handlers.move);
        removeEventListener('pointerup', this.#handlers.up);
    };

    /**@param {PointerEvent} evt */
    #move(evt) {
        let left = this.#el.offsetLeft + evt.movementX;
        let top = this.#el.offsetTop + evt.movementY;
        const container = this.container;

        if (container) {

            const elBounds = this.#el.getBoundingClientRect();
            const containerBounds = container.getBoundingClientRect();
            if (left + elBounds.width > containerBounds.right) {
                left = containerBounds.right - elBounds.width;
            } else if (left < containerBounds.left) {
                left = containerBounds.left;
            }

            if (top + elBounds.height > containerBounds.bottom) {
                top = containerBounds.bottom - elBounds.height;
            } else if (top < containerBounds.top) {
                top = containerBounds.top;
            }
        }

        this.#el.style.left = `${left}px`;
        this.#el.style.top = `${top}px`;
    }

    get draggableElement() {
        return this.handle || this.#el;
    }

    get container() {
        return typeof this.#options.container === 'string'
            ? document.querySelector(this.#options.container)
            : this.#options.container;
    }

    set container(container) {
        this.#options.container = container;
    }

    get handle() {
        return this.#options && typeof this.#options.handle === 'string'
            ? document.querySelector(this.#options.handle)
            : this.#options.handle;
    }

    set handle(handle) {
        this.destroy();
        this.#options.handle = handle;
        this.#install();
    }
}

