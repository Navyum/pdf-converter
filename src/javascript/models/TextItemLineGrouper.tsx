import { sortByX } from '../pageItemFunctions';
import TextItem from './TextItem';

export interface TextItemLineGrouperOptions {
  mostUsedDistance?: number;
}

export default class TextItemLineGrouper {
  private mostUsedDistance: number;

  constructor(options: TextItemLineGrouperOptions = {}) {
    this.mostUsedDistance = options.mostUsedDistance || 12;
  }

  group(textItems: TextItem[]): TextItem[][] {
    return this.groupItemsByLine(textItems);
  }

  groupItemsByLine(textItems: TextItem[]): TextItem[][] {
    const lines: TextItem[][] = [];
    let currentLine: TextItem[] = [];

    textItems.forEach(item => {
      if (currentLine.length > 0 &&
          Math.abs(currentLine[0].y - item.y) >= this.mostUsedDistance / 2) {
        lines.push(currentLine);
        currentLine = [];
      }
      currentLine.push(item);
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    lines.forEach(lineItems => {
      sortByX(lineItems);
    });

    return lines;
  }
} 