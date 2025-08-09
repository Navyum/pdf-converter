import LineItemBlock from '../LineItemBlock';
import LineItem from '../LineItem';
import Word from '../Word';
import { WordType } from '../markdown/WordType';
import { WordFormat } from '../markdown/WordFormat';
import { ParsedElements } from '../PageItem';

describe('LineItemBlock', () => {
  let lineItemBlock: LineItemBlock;

  beforeEach(() => {
    lineItemBlock = new LineItemBlock({});
  });

  it('should create an empty block', () => {
    expect(lineItemBlock.getItemCount()).toBe(0);
    expect(lineItemBlock.getText()).toBe('');
    expect(lineItemBlock.type).toBeUndefined();
  });

  it('should add a line item to the block', () => {
    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 100,
      height: 15,
      words: [
        new Word({ string: 'Hello', type: WordType.NORMAL }),
        new Word({ string: 'World', type: WordType.NORMAL })
      ],
      type: 'paragraph'
    });

    lineItemBlock.addItem(lineItem);

    expect(lineItemBlock.getItemCount()).toBe(1);
    expect(lineItemBlock.type).toBe('paragraph');
    expect(lineItemBlock.getText()).toBe('Hello World');
  });

  it('should merge parsed elements when adding items', () => {
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

    const lineItem1 = new LineItem({
      x: 10,
      y: 20,
      width: 100,
      height: 15,
      words: [new Word({ string: 'Hello' })],
      parsedElements: parsedElements1
    });

    const lineItem2 = new LineItem({
      x: 20,
      y: 35,
      width: 120,
      height: 15,
      words: [new Word({ string: 'World' })],
      parsedElements: parsedElements2
    });

    lineItemBlock.addItem(lineItem1);
    lineItemBlock.addItem(lineItem2);

    expect(lineItemBlock.parsedElements?.footnoteLinks).toEqual(['1', '2']);
    expect(lineItemBlock.parsedElements?.footnotes).toEqual(['First footnote', 'Second footnote']);
    expect(lineItemBlock.parsedElements?.containLinks).toBe(true);
    expect(lineItemBlock.parsedElements?.formattedWords).toBe('bolditalic');
  });

  it('should throw an error when adding items with different types', () => {
    const lineItem1 = new LineItem({
      x: 10,
      y: 20,
      width: 100,
      height: 15,
      words: [new Word({ string: 'Hello' })],
      type: 'paragraph'
    });

    const lineItem2 = new LineItem({
      x: 20,
      y: 35,
      width: 120,
      height: 15,
      words: [new Word({ string: 'World' })],
      type: 'header'
    });

    lineItemBlock.addItem(lineItem1);

    expect(() => {
      lineItemBlock.addItem(lineItem2);
    }).toThrow('Adding item of type header to block of type paragraph');
  });
}); 