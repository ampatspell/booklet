import { PDFDocument } from "pdf-lib";
import { load } from "./utils";

export class Source {
  doc: PDFDocument;
  constructor(doc: PDFDocument) {
    this.doc = doc;
  }

  get pages() {
    return this.doc.getPages();
  }
}

export const createSource = async (filename: string) => {
  const doc = await PDFDocument.load(await load(filename));
  return new Source(doc);
}
