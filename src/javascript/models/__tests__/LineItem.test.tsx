import LineItem from '../LineItem';
import Word from '../Word';
import { WordType } from '../markdown/WordType';
import { WordFormat } from '../markdown/WordFormat';
import { ParsedElements } from '../PageItem';

describe('LineItem', () => {
  it('should create a LineItem with basic coordinates and dimensions', () => {
    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15
    });

    expect(lineItem.x).toBe(10);
    expect(lineItem.y).toBe(20);
    expect(lineItem.width).toBe(200);
    expect(lineItem.height).toBe(15);
    expect(lineItem.words).toEqual([]);
  });

  it('should create a LineItem with words', () => {
    const words = [
      new Word({ string: 'Hello', type: WordType.NORMAL }),
      new Word({ string: 'World', type: WordType.NORMAL, format: WordFormat.BOLD })
    ];

    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15,
      words: words
    });

    expect(lineItem.words).toEqual(words);
    expect(lineItem.text()).toBe('Hello World');
    expect(lineItem.wordStrings()).toEqual(['Hello', 'World']);
  });

  it('should create words from text when no words are provided', () => {
    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15,
      text: 'Hello World'
    });

    expect(lineItem.words.length).toBe(2);
    expect(lineItem.words[0].string).toBe('Hello');
    expect(lineItem.words[1].string).toBe('World');
    expect(lineItem.text()).toBe('Hello World');
  });

  it('should ignore empty words when creating from text', () => {
    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15,
      text: 'Hello   World  '
    });

    expect(lineItem.words.length).toBe(2);
    expect(lineItem.words[0].string).toBe('Hello');
    expect(lineItem.words[1].string).toBe('World');
    expect(lineItem.text()).toBe('Hello World');
  });

  it('should support optional type and parsed elements', () => {
    const parsedElements = new ParsedElements({
      footnoteLinks: ['1'],
      footnotes: ['First footnote'],
      containLinks: true,
      formattedWords: 'bold'
    });

    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15,
      type: 'header',
      parsedElements: parsedElements
    });

    expect(lineItem.type).toBe('header');
    expect(lineItem.parsedElements).toBe(parsedElements);
  });

  it('should handle different word types and formats', () => {
    const words = [
      new Word({ string: 'Link', type: WordType.LINK }),
      new Word({ string: 'Footnote', type: WordType.FOOTNOTE }),
      new Word({ string: 'Italic', format: WordFormat.ITALIC }),
      new Word({ string: 'Underline', format: WordFormat.UNDERLINE })
    ];

    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 200,
      height: 15,
      words: words
    });

    expect(lineItem.words).toEqual(words);
    expect(lineItem.text()).toBe('Link Footnote Italic Underline');
  });
}); 