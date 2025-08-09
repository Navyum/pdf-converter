// PDF 解析或转换的结果
export interface ParseResultOptions {
  pages: any[]; // 可以是 Page[] 或其他类型
  globals?: Record<string, any>; // 调试模式下可访问的全局属性
  messages?: string[]; // 仅在调试模式下显示的消息
}

export default class ParseResult {
  pages: any[];
  globals: Record<string, any>;
  messages: string[];

  constructor(options: ParseResultOptions) {
    this.pages = options.pages;
    this.globals = options.globals || {};
    this.messages = options.messages || [];
  }

  // 添加一些实用方法
  addMessage(message: string): void {
    this.messages.push(message);
  }

  addGlobal(key: string, value: any): void {
    this.globals[key] = value;
  }
} 