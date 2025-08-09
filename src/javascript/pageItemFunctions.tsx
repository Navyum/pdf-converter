export type XLike = { x: number };

export type BlockWithItems<T extends XLike = XLike> = {
  items: T[];
};

export function minXFromBlocks<T extends XLike = XLike>(blocks: Array<BlockWithItems<T>>): number | null {
  let minX = 999;
  blocks.forEach(block => {
    block.items.forEach(item => {
      minX = Math.min(minX, item.x);
    });
  });
  if (minX === 999) {
    return null;
  }
  return minX;
}

export function minXFromPageItems<T extends XLike = XLike>(items: T[]): number | null {
  let minX = 999;
  items.forEach(item => {
    minX = Math.min(minX, item.x);
  });
  if (minX === 999) {
    return null;
  }
  return minX;
}

export function sortByX<T extends XLike = XLike>(items: T[]): void {
  items.sort((a, b) => a.x - b.x);
}

export function sortCopyByX<T extends XLike = XLike>(items: T[]): T[] {
  const copy = items.concat();
  sortByX(copy);
  return copy;
} 