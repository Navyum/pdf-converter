import TextItem from './models/TextItem';

export function sortByX(items: TextItem[]): void {
  items.sort((a, b) => a.x - b.x);
} 