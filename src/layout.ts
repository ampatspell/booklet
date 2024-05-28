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

export const layout = (pages: number) => {
  const rounded = roundUp(pages);

  const init = () => {
    return new Array(rounded / 4).fill(undefined).map(() => ({}));
  }

  const obverse: Spread[] = init();
  const averse: Spread[] = init();

  for(let i = 0; i < rounded / 4; i++) {
    const base = i * 2;
    const back = rounded - (i * 2);
    obverse[i].left = back - 1;
    obverse[i].right = base;
    averse[i].left = base + 1;
    averse[i].right = back - 2;
  }

  return { obverse, averse };
}
