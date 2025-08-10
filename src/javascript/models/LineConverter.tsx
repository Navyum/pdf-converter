import TextItem from './TextItem';
import LineItem from './LineItem';
import Word from './Word';
import WordType from './markdown/WordType';
import WordFormatModule from './markdown/WordFormat';
import StashingStream from './StashingStream';
import { ParsedElements } from './PageItem';

export interface LineConverterOptions {
  fontToFormats: Map<string, string>;
}

export default class LineConverter {
  private fontToFormats: Map<string, string>;

  constructor(fontToFormats: Map<string, string>) {
    this.fontToFormats = fontToFormats;
  }

  compact(textItems: TextItem[]): LineItem {
    if (textItems.length === 0) {
      throw new Error('No text items provided');
    }

    const firstItem = textItems[0];
    const lastItem = textItems[textItems.length - 1];
    
    const stream = new WordDetectionStream(this.fontToFormats);
    stream.consumeAll(textItems);
    const words = stream.complete();

    return new LineItem({
      x: firstItem.x,
      y: firstItem.y,
      width: lastItem.x + lastItem.width - firstItem.x,
      height: firstItem.height,
      words: words,
      parsedElements: new ParsedElements({
        containLinks: stream.containLinks,
        formattedWords: stream.formattedWords.toString(),
        footnoteLinks: stream.footnoteLinks.map(String),
        footnotes: stream.footnotes
      })
    });
  }
}

class WordDetectionStream extends StashingStream<TextItem, Word> {
  private fontToFormats: Map<string, string>;
  footnoteLinks: number[];
  footnotes: string[];
  formattedWords: number;
  containLinks: boolean;

  private firstY?: number;
  private stashedNumber: boolean;
  private currentItem?: TextItem;

  constructor(fontToFormats: Map<string, string>) {
    super();
    this.fontToFormats = fontToFormats;
    this.footnoteLinks = [];
    this.footnotes = [];
    this.formattedWords = 0;
    this.containLinks = false;
    this.stashedNumber = false;
  }

  protected convertItem(item: TextItem): Word {
    // 检查 item.text 是否存在
    if (!item.text || item.text.trim() === '') {
      // 如果text为空，尝试从其他属性获取内容
      // 或者直接跳过这个项目
      return new Word({
        string: '',
        format: undefined
      });
    }
    
    const format = this.fontToFormats.get(item.font || '');
    const isNumber = /^\d+$/.test(item.text.trim());
    
    if (isNumber && !this.firstY) {
      this.firstY = item.y;
    }
    
    return new Word({
      string: item.text,
      format: WordFormatModule.enumValueOf(format) || undefined
    });
  }

  protected shouldStash(item: TextItem): boolean {
    // 检查 item.text 是否存在，避免处理图片项时出错
    if (!item.text || item.text.trim() === '') {
      return false;
    }
    const isNumber = /^\d+$/.test(item.text.trim());
    return isNumber;
  }

  protected onPushOnStash(item: TextItem): void {
    this.stashedNumber = true;
    this.currentItem = item;
  }

  protected doMatchesStash(lastItem: TextItem, item: TextItem): boolean {
    // 检查 item.text 是否存在，避免处理图片项时出错
    if (!item.text || !lastItem.text || item.text.trim() === '' || lastItem.text.trim() === '') {
      return false;
    }
    
    const lastItemFormat = this.fontToFormats.get(lastItem.font || '');
    const itemFormat = this.fontToFormats.get(item.font || '');
    
    if (lastItemFormat !== itemFormat) {
      return false;
    }
    
    const itemIsANumber = /^\d+$/.test(item.text.trim());
    return this.stashedNumber === itemIsANumber;
  }

  protected doFlushStash(stash: TextItem[], results: Word[]): void {
    if (this.stashedNumber) {
      const joinedNumber = stash.map(item => item.text).join('').trim();
      
      if (stash[0].y > (this.firstY || 0)) { // 脚注链接
        results.push(new Word({
          string: joinedNumber,
          type: WordType.FOOTNOTE_LINK,
          format: undefined
        }));
        this.footnoteLinks.push(parseInt(joinedNumber));
      } else if (this.currentItem && this.currentItem.y < stash[0].y) { // 脚注
        results.push(new Word({
          string: joinedNumber,
          type: WordType.FOOTNOTE,
          format: undefined
        }));
        this.footnotes.push(joinedNumber);
      } else {
        this.copyStashItemsAsText(stash, results);
      }
    } else {
      this.copyStashItemsAsText(stash, results);
    }
  }

  private copyStashItemsAsText(stash: TextItem[], results: Word[]): void {
    const format = this.fontToFormats.get(stash[0].font || '');
    results.push(...this.itemsToWords(stash, format));
  }

  private itemsToWords(items: TextItem[], formatName?: string): Word[] {
    const combinedText = combineText(items);
    const words = combinedText.split(' ');
    const format = WordFormatModule.enumValueOf(formatName);
    
    return words
      .filter(w => w.trim().length > 0)
      .map(word => {
        let type: WordType | undefined;
        
        if (word.startsWith('http:')) {
          this.containLinks = true;
          type = WordType.LINK;
        } else if (word.startsWith('www.')) {
          this.containLinks = true;
          word = `http://${word}`;
          type = WordType.LINK;
        }

        if (format) {
          this.formattedWords++;
        }

        return new Word({
          string: word,
          type: type,
          format: format || undefined
        });
      });
  }
}

function combineText(textItems: TextItem[]): string {
  let text = '';
  let lastItem: TextItem | null = null;
  
  textItems.forEach(textItem => {
    
    // 对于文本项，检查 text 属性
    if (!textItem.text || textItem.text.trim() === '') {
      // 空的文本项，跳过
      return;
    }
    
    let textToAdd = textItem.text;
    
    if (!text.endsWith(' ') && !textToAdd.startsWith(' ')) {
      if (lastItem) {
        const xDistance = textItem.x - lastItem.x - lastItem.width;
        if (xDistance > 5) {
          text += ' ';
        }
      } else {
        if (isListItemCharacter(textItem.text)) {
          textToAdd += ' ';
        }
      }
    }
    
    text += textToAdd;
    lastItem = textItem;
  });
  
  return text;
}

function isListItemCharacter(text: string): boolean {
  return /^[-*+]\s/.test(text);
}

function isNumber(text: string): boolean {
  return /^\d+$/.test(text);
} 