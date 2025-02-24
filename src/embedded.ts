import { PDFEmbeddedPage } from "pdf-lib";
import { Target } from "./target";
import { Source } from "./source";
import { Spread } from "./layout";

const scaled = (value: number, scale: number) => value * scale;

export class EmbeddedPages {
  target: Target;
  source: Source;
  pages: PDFEmbeddedPage[];

  constructor(target: Target, source: Source, pages: PDFEmbeddedPage[]) {
    this.target = target;
    this.source = source;
    this.pages = pages;
  }

  embeddedPage(index?: number) {
    if(index !== undefined) {
      return this.pages[index];
    }
  }

  async drawSpreads(spreads: Spread[], scale: number) {
    for(let spread of spreads) {
      const page = this.target.addPage();
      const left = this.embeddedPage(spread.left);
      const right = this.embeddedPage(spread.right);
      if(left || right) {
        const leftOrRight = (left || right)!;
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const width = scaled(leftOrRight.width, scale);
        const height = scaled(leftOrRight.height, scale);
        await this.target.drawSpread({
          spread,
          page,
          left,
          right,
          x: pageWidth / 2 - width,
          y: pageHeight / 2 - height / 2,
          width,
          height,
        });
      }
    }
  }
}
