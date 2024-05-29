import { PageSizes } from 'pdf-lib';
import { run, toLandscape } from './utils';
import { createSource } from './source';
import { createLayout } from './layout';
import { createTargets } from './targets';

const input = 'input.pdf';
const pageSize = toLandscape(PageSizes.A4);
const scale = 0.55;
const output = 'output.pdf';

run(async () => {
  const source = await createSource(input);
  const layout = createLayout(source.pages.length);
  const targets = await createTargets(pageSize);
  const embedded = await targets.embedSource(source);
  await embedded.drawSpreads(layout, scale);
  await embedded.save(output);
});
