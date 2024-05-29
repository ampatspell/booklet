import { PageSizes } from 'pdf-lib';
import { run, toLandscape } from './utils';
import { createSource } from './source';
import { createTarget } from './target';

const scaled = (value: number, scale: number) => value * scale;

run(async () => {
  const source = await createSource('input.pdf');
  const target = await createTarget(toLandscape(PageSizes.A4));
  const embedded = await target.embedSource(source);

  for(const spread of embedded.spreads) {
    const page = target.addPage();
    const left = spread.left;
    const right = spread.right;
    if(left || right) {
      const leftOrRight = (left || right)!;
      const pageWidth = page.getWidth();
      const pageHeight = page.getHeight();
      const scale = 0.55;
      const width = scaled(leftOrRight.width, scale);
      const height = scaled(leftOrRight.height, scale);

      target.drawSpread({
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

  await target.save('output.pdf');
});
