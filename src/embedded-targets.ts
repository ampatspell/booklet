import { parse } from "path";
import { EmbeddedPages } from "./embedded";
import { Spread } from "./layout";

export class EmbeddedTargets {
  top: EmbeddedPages;
  bottom: EmbeddedPages;

  constructor(top: EmbeddedPages, bottom: EmbeddedPages) {
    this.top = top;
    this.bottom = bottom;
  }

  async drawSpreads(layout: { top: Spread[], bottom: Spread[] }, scale: number) {
    await Promise.all([
      this.top.drawSpreads(layout.top, scale),
      this.bottom.drawSpreads(layout.bottom, scale),
    ]);
  }

  async save(filename: string) {
    const { name, ext } = parse(filename);
    const fullName = (postfix: string) => `${name}-${postfix}${ext}`;
    await Promise.all([
      this.top.target.save(fullName('1')),
      this.bottom.target.save(fullName('2')),
    ]);
  }
}
