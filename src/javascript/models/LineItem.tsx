import PageItem from './PageItem';
import Word from './Word';
import { ParsedElements } from './PageItem';
import WordType from './markdown/WordType';

export interface LineItemOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  words?: Word[];
  text?: string;
  type?: string;
  parsedElements?: ParsedElements;
  pageNumber?: number;
}

export default class LineItem extends PageItem {
  x: number;
  y: number;
  width: number;
  height: number;
  words: Word[];

  constructor(options: LineItemOptions) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;

    this.words = options.words || [];
    if (options.text && this.words.length === 0) {
      this.words = options.text
        .split(" ")
        .filter(string => string.trim().length > 0)
        .map(wordAsString => new Word({ string: wordAsString }));
    }
  }

  text(): string {
    return this.wordStrings().join(" ");
  }

  wordStrings(): string[] {
    return this.words.map(word => word.string);
  }
} 