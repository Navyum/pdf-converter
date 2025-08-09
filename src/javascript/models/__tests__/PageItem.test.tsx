import { ParsedElements } from '../PageItem';
import PageItem from '../PageItem';

// 用于测试的具体 PageItem 实现
class TestPageItem extends PageItem {
  constructor(options: any) {
    super(options);
  }
}

describe('ParsedElements', () => {
  it('should create an empty ParsedElements object', () => {
    const parsedElements = new ParsedElements({});

    expect(parsedElements.footnoteLinks).toEqual([]);
    expect(parsedElements.footnotes).toEqual([]);
    expect(parsedElements.containLinks).toBeUndefined();
    expect(parsedElements.formattedWords).toBe('');
  });

  it('should create a ParsedElements object with initial data', () => {
    const parsedElements = new ParsedElements({
      footnoteLinks: ['1', '2'],
      footnotes: ['First footnote', 'Second footnote'],
      containLinks: true,
      formattedWords: 'bold'
    });

    expect(parsedElements.footnoteLinks).toEqual(['1', '2']);
    expect(parsedElements.footnotes).toEqual(['First footnote', 'Second footnote']);
    expect(parsedElements.containLinks).toBe(true);
    expect(parsedElements.formattedWords).toBe('bold');
  });

  it('should add another ParsedElements object', () => {
    const parsedElements1 = new ParsedElements({
      footnoteLinks: ['1'],
      footnotes: ['First footnote'],
      containLinks: true,
      formattedWords: 'bold'
    });

    const parsedElements2 = new ParsedElements({
      footnoteLinks: ['2'],
      footnotes: ['Second footnote'],
      containLinks: false,
      formattedWords: 'italic'
    });

    parsedElements1.add(parsedElements2);

    expect(parsedElements1.footnoteLinks).toEqual(['1', '2']);
    expect(parsedElements1.footnotes).toEqual(['First footnote', 'Second footnote']);
    expect(parsedElements1.containLinks).toBe(true);
    expect(parsedElements1.formattedWords).toBe('bolditalic');
  });
});

describe('PageItem', () => {
  it('should prevent direct instantiation of abstract class', () => {
    expect(() => {
      // @ts-expect-error Testing abstract class instantiation
      new PageItem({});
    }).toThrow(TypeError);
  });

  it('should create a concrete PageItem with basic properties', () => {
    const parsedElements = new ParsedElements({
      footnoteLinks: ['1'],
      footnotes: ['First footnote']
    });

    const pageItem = new TestPageItem({
      type: 'text',
      annotation: 'Test annotation',
      parsedElements: parsedElements,
      pageNumber: 1
    });

    expect((pageItem as any).type).toBe('text');
    expect((pageItem as any).annotation).toBe('Test annotation');
    expect((pageItem as any).parsedElements).toBe(parsedElements);
    expect((pageItem as any).pageNumber).toBe(1);
  });

  it('should create a PageItem with minimal properties', () => {
    const pageItem = new TestPageItem({});

    expect((pageItem as any).type).toBeUndefined();
    expect((pageItem as any).annotation).toBeUndefined();
    expect((pageItem as any).parsedElements).toBeUndefined();
    expect((pageItem as any).pageNumber).toBeUndefined();
  });
}); 