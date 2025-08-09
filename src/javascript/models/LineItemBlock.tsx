import LineItem from './LineItem';
import PageItem from './PageItem';
import { ParsedElements } from './PageItem';
import WordType from './markdown/WordType';
import WordFormat from './markdown/WordFormat';

export interface LineItemBlockOptions {
  type?: string;
  items?: LineItem[];
  parsedElements?: ParsedElements;
  annotation?: any;
  pageNumber?: number;
}

export default class LineItemBlock extends PageItem {
  items: LineItem[];

  constructor(options: LineItemBlockOptions) {
    super(options);
    this.items = [];

    if (options.items) {
      options.items.forEach(item => this.addItem(item));
    }
  }

  addItem(item: LineItem): void {
    if (this.type && item.type && this.type !== item.type) {
      throw new Error(`Adding item of type ${item.type} to block of type ${this.type}`);
    }

    if (!this.type) {
      this.type = item.type;
    }

    if (item.parsedElements) {
      if (this.parsedElements) {
        this.parsedElements.add(item.parsedElements);
      } else {
        this.parsedElements = item.parsedElements;
      }
    }

    const copiedItem = new LineItem({
      ...item,
      type: item.type // 保留原始类型
    });
    this.items.push(copiedItem);
  }

  getItemCount(): number {
    return this.items.length;
  }

  getText(): string {
    return this.items.map(item => item.text()).join('\n');
  }
} 