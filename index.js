const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const { createCanvas } = require('canvas');

class CanvasFactory {
    create(width, height) {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
        return { canvas, context };
    }
    reset(obj, width, height) {
        obj.canvas.width = width;
        obj.canvas.height = height;
    }
    destroy(obj) {
        obj.canvas.width = 0;
        obj.canvas.height = 0;
        obj.canvas = null;
        obj.context = null;
    }
}

class Draw {
    constructor() {
        this.pages = [];
    }
    init() {
        const width = this.pages[0].width;
        const height = this.pages.reduce((p, page) => p + page.height, 0);
        this.canvas = createCanvas(width, height);
        this.context = this.canvas.getContext('2d');
        this.height = height;
    }
    draw() {
        this.init();
        let height = this.height;
        for (const page of this.pages.reverse()) {
            height -= page.height;
            this.context.drawImage(page, 0, height);
        }
    }
    getBuffer() {
        return this.canvas.toBuffer();
    }
    putPage(page) {
        this.pages.push(page);
    }
}

async function app(pdfData, options = {}) {
    const scale = options.scale || 1;
    const pageNumber = options.page || 0;
    const doc = await pdfjsLib.getDocument(pdfData).promise;
    const draw = new Draw();
    const processPage = async (pageNumber) => {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvasFactory = new CanvasFactory();
        const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);
        const renderContext = { canvasContext: context, viewport, canvasFactory };
        await page.render(renderContext).promise;
        draw.putPage(canvas);
    }
    if (!pageNumber) {
        for (let i = 0; i < doc.numPages; i++) {
            await processPage(i + 1);
        }
    } else {
        await processPage(pageNumber);
    }
    draw.draw();
    return draw.getBuffer();
}

module.exports = app;
