import { EmbeddedTargets } from "./embedded-targets";
import { Source } from "./source";
import { Target, createTarget } from "./target";
import { PageSize } from "./utils";

class Targets {
  top: Target;
  bottom: Target;

  constructor(top: Target, bottom: Target) {
    this.top = top;
    this.bottom = bottom;
  }

  async embedSource(source: Source) {
    const [ top, bottom ] = await Promise.all([
      this.top.embedSource(source),
      this.bottom.embedSource(source),
    ]);
    return new EmbeddedTargets(top, bottom);
  }
}

export const createTargets = async (pageSize: PageSize) => {
  const [ top, bottom ] = await Promise.all([
    createTarget(pageSize),
    createTarget(pageSize)
  ]);
  return new Targets(top, bottom);
}
