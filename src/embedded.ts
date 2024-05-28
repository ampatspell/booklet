import { PDFEmbeddedPage } from "pdf-lib";

export class EmbeddedPageSpread {
  left: PDFEmbeddedPage | undefined;
  right: PDFEmbeddedPage | undefined;

  constructor(left?: PDFEmbeddedPage, right?: PDFEmbeddedPage) {
    this.left = left;
    this.right = right;
  }
}

export class EmbeddedPages {
  pages: PDFEmbeddedPage[];
  spreads: EmbeddedPageSpread[];

  constructor(pages: PDFEmbeddedPage[]) {
    this.pages = pages;
    this.spreads = this.createSpreads();
  }

  private createSpreads() {
    const pages = this.pages;
    const count = Math.ceil(pages.length / 2);
    const spreads: EmbeddedPageSpread[] = [];
    for(let i = 0; i < count; i++) {
      const left = pages[i * 2];
      const right = pages[(i * 2) + 1];
      spreads.push(new EmbeddedPageSpread(left, right));
    }
    return spreads;
  }
}
