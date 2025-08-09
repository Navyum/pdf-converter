import PageItem from './PageItem';
import { WordType } from './markdown/WordType';
import { WordFormat } from './markdown/WordFormat';

export interface TextItemOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  font?: string;
  lineFormat?: string;
  unopenedFormat?: string;
  unclosedFormat?: string;
  pageNumber?: number;
  type?: string;
  annotation?: any;
  parsedElements?: any;
}

export default class TextItem extends PageItem {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  font?: string;
  lineFormat?: string;
  unopenedFormat?: string;
  unclosedFormat?: string;

  constructor(options: TextItemOptions) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.text = options.text;
    this.font = options.font;
    this.lineFormat = options.lineFormat;
    this.unopenedFormat = options.unopenedFormat;
    this.unclosedFormat = options.unclosedFormat;
  }
} 