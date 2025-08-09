// 定义解析元素接口
export interface ParsedElementsOptions {
  footnoteLinks?: string[];
  footnotes?: string[];
  containLinks?: boolean;
  formattedWords?: string;
}

// 解析元素类
export class ParsedElements {
  footnoteLinks: string[];
  footnotes: string[];
  containLinks?: boolean;
  formattedWords: string;

  constructor(options: ParsedElementsOptions) {
    this.footnoteLinks = options.footnoteLinks || [];
    this.footnotes = options.footnotes || [];
    this.containLinks = options.containLinks;
    this.formattedWords = options.formattedWords || '';
  }

  // 合并解析元素
  add(parsedElements: ParsedElements): void {
    this.footnoteLinks = this.footnoteLinks.concat(parsedElements.footnoteLinks);
    this.footnotes = this.footnotes.concat(parsedElements.footnotes);
    this.containLinks = this.containLinks || parsedElements.containLinks;
    this.formattedWords += parsedElements.formattedWords;
  }
}

// 定义 PageItem 选项接口
export interface PageItemOptions {
  type?: string;
  annotation?: string;
  parsedElements?: ParsedElements;
  pageNumber?: number;
}

// 抽象页面项基类
export default abstract class PageItem {
  type?: string;
  annotation?: string;
  parsedElements?: ParsedElements;
  pageNumber?: number;

  constructor(options: PageItemOptions) {
    // 防止直接实例化抽象类
    if (new.target === PageItem) {
      throw new TypeError("Cannot construct PageItem instances directly");
    }

    this.type = options.type;
    this.annotation = options.annotation;
    this.parsedElements = options.parsedElements;
    this.pageNumber = options.pageNumber;
  }
} 