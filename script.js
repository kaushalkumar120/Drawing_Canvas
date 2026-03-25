class PaintApp {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.colorPicker = document.getElementById("colorPicker");
        this.brushSize = document.getElementById("brushSize");
        this.sizeValue = document.getElementById("sizeValue");
        this.eraserBtn = document.getElementById("eraserBtn");
        this.clearBtn = document.getElementById("clearBtn");
        this.saveBtn = document.getElementById("saveBtn");
        this.indicator = document.getElementById("indicator");

        this.painting = false;
        this.isEraser = false;

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.addEvents();
        this.updateUI();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.6;
    }

    addEvents() {
        this.canvas.addEventListener("mousedown", (e) => this.start(e));
        this.canvas.addEventListener("mouseup", () => this.stop());
        this.canvas.addEventListener("mousemove", (e) => this.draw(e));

        // Mobile support
        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.start(e.touches[0]);
        });

        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });

        this.canvas.addEventListener("touchend", () => this.stop());

        // Controls
        this.brushSize.addEventListener("input", () => this.updateUI());

        this.eraserBtn.addEventListener("click", () => {
            this.isEraser = !this.isEraser;
            this.eraserBtn.innerText = this.isEraser ? "✏️ Brush" : "🧽 Eraser";
            this.updateUI();
        });

        this.clearBtn.addEventListener("click", () => {
            if(confirm("Clear canvas?")) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        });

        this.saveBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.download = "drawing.png";
            link.href = this.canvas.toDataURL();
            link.click();
        });
    }

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    start(e) {
        this.painting = true;
        this.draw(e);
    }

    draw(e) {
        if (!this.painting) return;

        const pos = this.getPos(e);

        this.ctx.lineWidth = this.brushSize.value;
        this.ctx.strokeStyle = this.isEraser ? "#ffffff" : this.colorPicker.value;

        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }

    stop() {
        this.painting = false;
        this.ctx.beginPath();
    }

    updateUI() {
        this.sizeValue.innerText = this.brushSize.value + "px";
        const tool = this.isEraser ? "🧽 Eraser" : "✏️ Brush";
        this.indicator.innerText = `${tool} | ${this.brushSize.value}px`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PaintApp();
});