import { PDFDocument, PDFEmbeddedPage, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";
import { PageSize, save } from "./utils";
import { Source } from "./source";
import { EmbeddedPages } from "./embedded";
import { Spread } from "./layout";

type DrawSpreadOptions = {
  spread: Spread;
  page: PDFPage;
  left?: PDFEmbeddedPage;
  right?: PDFEmbeddedPage;
  x: number;
  y: number;
  width: number;
  height: number;
};

export class Target {
  doc: PDFDocument;
  pageSize: PageSize;
  constructor(doc: PDFDocument, pageSize: PageSize) {
    this.doc = doc;
    this.pageSize = pageSize;
  }

  async embedSource(source: Source) {
    const pages = await this.doc.embedPdf(source.doc, source.doc.getPageIndices());;
    return new EmbeddedPages(this, source, pages);
  }

  addPage() {
    return this.doc.addPage(this.pageSize);
  }

  _font?: PDFFont;

  async font() {
    let font = this._font;
    if(!font) {
      font = await this.doc.embedFont(StandardFonts.Helvetica);
      this._font = font;
    }
    return font;
  }

  async drawSpread(opts: DrawSpreadOptions) {
    const { page, spread, left, right, x, y, width, height } = opts;
    const leftOrRight = left || right;
    if(!leftOrRight) {
      return;
    }

    {
      const rest = { width, height, y };

      const draw = async (embedded: PDFEmbeddedPage, { x, number }: { x: number, number?: number }) => {
        page.drawPage(embedded, {
          x,
          ...rest,
        });
        page.drawText(`${(number ?? 0) + 1}`, {
          font: await this.font(),
          x: x + (width / 2),
          y: (page.getHeight() / 2) - (height / 2) - 30,
          color: rgb(0, 0, 0),
          size: 8,
        });
      }

      if(left) {
        await draw(left, { x, number: spread.left });
      }
      if(right) {
        await draw(right, { x: x + width, number: spread.right });
      }
    }

    {
      const rest = {
        thickness: 0.1,
        color: rgb(0, 0, 0),
        opacity: 0.7,
      };

      const size = 25;
      const offset = 2;

      const vertical = (x: number, negativeOffset: number=0) => {
        const o = offset - negativeOffset;
        const line = { x };
        // top
        page.drawLine({
          start: { y: y + height + o, ...line },
          end: { y: y + height + size, ...line },
          ...rest,
        });
        // bottom
        page.drawLine({
          start: { y: y - o, ...line },
          end: { y: y - size, ...line },
          ...rest,
        });
      }

      const horizontal = (y: number) => {
        const line = { y };
        // left
        page.drawLine({
          start: { x: x - offset, ...line },
          end: { x: x - size, ...line },
          ...rest
        });
        // right
        page.drawLine({
          start: { x: x + offset + width + width, ...line },
          end: { x: x + width + width + size, ...line },
          ...rest
        });
      }

      vertical(x); // left
      vertical(x + width, offset * 2); // middle
      vertical(x + width + width); // left

      horizontal(y + height); // top
      horizontal(y); // bottom
    }
  }

  async save(filename: string) {
    const buffer = Buffer.from(await this.doc.save());
    await save(filename, buffer);
  }
}

export const createTarget = async (pageSize: PageSize) => {
  const doc = await PDFDocument.create();
  return new Target(doc, pageSize);
}
