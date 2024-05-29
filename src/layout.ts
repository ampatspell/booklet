export type Spread = {
  left?: number;
  right?: number;
};

const roundUp = (number: number) => {
  const res = number % 2;
  if(res === 0) {
    return number;
  }
  return number - res + 4;
};

export const createLayout = (pages: number) => {
  const rounded = roundUp(pages);

  const init = () => {
    return new Array(rounded / 4).fill(undefined).map(() => ({}));
  }

  const top: Spread[] = init();
  const bottom: Spread[] = init();

  for(let i = 0; i < rounded / 4; i++) {
    const base = i * 2;
    const back = rounded - base;
    top[i].left = back - 1;
    top[i].right = base;
    bottom[i].left = base + 1;
    bottom[i].right = back - 2;
  }

  return { top, bottom };
}
