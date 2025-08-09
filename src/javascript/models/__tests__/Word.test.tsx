import Word from '../Word';
import { WordType } from '../markdown/WordType';
import { WordFormat } from '../markdown/WordFormat';

describe('Word', () => {
  it('should create a word with only a string', () => {
    const word = new Word({ string: 'Hello' });

    expect(word.string).toBe('Hello');
    expect(word.type).toBeUndefined();
    expect(word.format).toBeUndefined();
  });

  it('should create a word with a string and type', () => {
    const word = new Word({
      string: 'Introduction',
      type: WordType.HEADER
    });

    expect(word.string).toBe('Introduction');
    expect(word.type).toBe(WordType.HEADER);
    expect(word.format).toBeUndefined();
  });

  it('should create a word with a string and format', () => {
    const word = new Word({
      string: 'Important',
      format: WordFormat.BOLD
    });

    expect(word.string).toBe('Important');
    expect(word.type).toBeUndefined();
    expect(word.format).toBe(WordFormat.BOLD);
  });

  it('should create a word with string, type, and format', () => {
    const word = new Word({
      string: 'Link',
      type: WordType.LINK,
      format: WordFormat.UNDERLINE
    });

    expect(word.string).toBe('Link');
    expect(word.type).toBe(WordType.LINK);
    expect(word.format).toBe(WordFormat.UNDERLINE);
  });

  it('should handle different word types', () => {
    const testCases = [
      { type: WordType.NORMAL, expectedType: WordType.NORMAL },
      { type: WordType.HEADER, expectedType: WordType.HEADER },
      { type: WordType.LIST_ITEM, expectedType: WordType.LIST_ITEM },
      { type: WordType.CODE, expectedType: WordType.CODE },
      { type: WordType.QUOTE, expectedType: WordType.QUOTE },
      { type: WordType.LINK, expectedType: WordType.LINK },
      { type: WordType.FOOTNOTE_LINK, expectedType: WordType.FOOTNOTE_LINK },
      { type: WordType.FOOTNOTE, expectedType: WordType.FOOTNOTE }
    ];

    testCases.forEach(({ type, expectedType }) => {
      const word = new Word({
        string: 'Test',
        type: type
      });

      expect(word.type).toBe(expectedType);
    });
  });

  it('should handle different word formats', () => {
    const testCases = [
      { format: WordFormat.BOLD, expectedFormat: WordFormat.BOLD },
      { format: WordFormat.ITALIC, expectedFormat: WordFormat.ITALIC },
      { format: WordFormat.UNDERLINE, expectedFormat: WordFormat.UNDERLINE },
      { format: WordFormat.STRIKETHROUGH, expectedFormat: WordFormat.STRIKETHROUGH }
    ];

    testCases.forEach(({ format, expectedFormat }) => {
      const word = new Word({
        string: 'Test',
        format: format
      });

      expect(word.format).toBe(expectedFormat);
    });
  });
}); 