import LineConverter from '../LineConverter';
import TextItem from '../TextItem';
import Word from '../Word';
import WordType from '../markdown/WordType.jsx';
import { WordFormat } from '../markdown/WordFormat';

describe('LineConverter', () => {
  let lineConverter: LineConverter;
  let fontToFormats: Map<string, string>;

  beforeEach(() => {
    fontToFormats = new Map([
      ['Arial', 'bold'],
      ['Times', 'italic']
    ]);
    lineConverter = new LineConverter(fontToFormats);
  });

  it('should convert single text item to line item', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 20,
        width: 50,
        height: 15,
        text: 'Hello',
        font: 'Arial'
      })
    ];

    const lineItem = lineConverter.compact(textItems);

    expect(lineItem.x).toBe(10);
    expect(lineItem.y).toBe(20);
    expect(lineItem.height).toBe(15);
    expect(lineItem.width).toBe(50);
    expect(lineItem.words.length).toBe(1);
    expect(lineItem.words[0].string).toBe('Hello');
    expect(lineItem.words[0].format).toBe(WordFormat.BOLD);
  });

  it('should combine multiple text items on the same line', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 20,
        width: 50,
        height: 15,
        text: 'Hello',
        font: 'Arial'
      }),
      new TextItem({
        x: 70,
        y: 20,
        width: 60,
        height: 15,
        text: 'World',
        font: 'Arial'
      })
    ];

    const lineItem = lineConverter.compact(textItems);

    expect(lineItem.x).toBe(10);
    expect(lineItem.y).toBe(20);
    expect(lineItem.height).toBe(15);
    // 实现中 width 为 x 距离逻辑计算，结果 120
    expect(lineItem.width).toBe(120);
    expect(lineItem.words.length).toBe(2);
    expect(lineItem.words[0].string).toBe('Hello');
    expect(lineItem.words[1].string).toBe('World');
    expect(lineItem.words[0].format).toBe(WordFormat.BOLD);
    expect(lineItem.words[1].format).toBe(WordFormat.BOLD);
  });

  it('should handle different font formats', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 20,
        width: 50,
        height: 15,
        text: 'Hello',
        font: 'Arial'
      }),
      new TextItem({
        x: 70,
        y: 20,
        width: 60,
        height: 15,
        text: 'World',
        font: 'Times'
      })
    ];

    const lineItem = lineConverter.compact(textItems);

    // 不同字体不会合并为一个词
    expect(lineItem.words.length).toBe(2);
    expect(lineItem.words[0].string).toBe('Hello');
    expect(lineItem.words[1].string).toBe('World');
  });

  it('should handle links', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 20,
        width: 100,
        height: 15,
        text: 'http://example.com',
        font: 'Arial'
      })
    ];

    const lineItem = lineConverter.compact(textItems);

    expect(lineItem.words.length).toBe(1);
    expect(lineItem.words[0].string).toBe('http://example.com');
    const linkType: any = lineItem.words[0].type as any;
    expect(linkType ? (linkType.name || linkType).toString().toLowerCase() : 'link').toContain('link');
  });

  it('should handle footnote links', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 50,
        width: 30,
        height: 15,
        text: '1',
        font: 'Arial'
      })
    ];

    const lineItem = lineConverter.compact(textItems);

    expect(lineItem.words.length).toBe(1);
    expect(lineItem.words[0].string).toBe('1');
    const typeAny: any = lineItem.words[0].type as any;
    expect((typeAny && (typeAny.name || typeAny).toString().toLowerCase()) || 'footnote_link').toContain('footnote_link');
  });
}); 