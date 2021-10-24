const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const { createCanvas } = require("canvas");

class CanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
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
  constructor(width, height) {
    this.pages = [];
    this.width = width;
    this.height = height;
  }
  init() {
    this.canvas = createCanvas(this.width, this.height);
    this.context = this.canvas.getContext("2d");
  }
  draw() {
    this.init();
    let currentY = this.height;
    for (const page of this.pages.reverse()) {
      currentY -= page.height;
      const x = (this.width - page.width) / 2;
      const y = currentY;
      this.context.drawImage(page, x, y);
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

  const pages = [];

  for (let i = 0; i < doc.numPages; i++) {
    if (pageNumber && pageNumber !== i + 1) {
      continue;
    }
    const page = await doc.getPage(i + 1);
    const viewport = page.getViewport({ scale });
    const width = Math.ceil(viewport.width);
    const height = Math.ceil(viewport.height);
    pages.push({
      page,
      viewport,
      width,
      height,
    });
  }

  const width = Math.max(...pages.map(p => p.width));
  const height = pages.reduce((p, item) => p + item.height, 0);

  const draw = new Draw(width, height);

  for (const pageItem of pages) {
    const { page, viewport, width, height } = pageItem;
    const canvasFactory = new CanvasFactory();
    const { canvas, context } = canvasFactory.create(width, height);
    const renderContext = { canvasContext: context, viewport, canvasFactory };
    await page.render(renderContext).promise;
    draw.putPage(canvas);
  }

  draw.draw();
  return draw.getBuffer();
}

module.exports = app;
