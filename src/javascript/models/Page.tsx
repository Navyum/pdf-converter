import PageItem from './PageItem';

export interface PageOptions {
  index: number;
  items?: PageItem[];
}

export default class Page {
  index: number;
  items: PageItem[];

  constructor(options: PageOptions) {
    this.index = options.index;
    this.items = options.items || [];
  }

  addItem(item: PageItem): void {
    this.items.push(item);
  }

  getItemCount(): number {
    return this.items.length;
  }

  clearItems(): void {
    this.items = [];
  }
} 