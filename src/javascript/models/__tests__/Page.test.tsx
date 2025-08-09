import Page from '../Page';
import PageItem from '../PageItem';
import TextItem from '../TextItem';
import LineItem from '../LineItem';
import Word from '../Word';
import { WordType } from '../markdown/WordType';

describe('Page', () => {
  it('should create a page with an index', () => {
    const page = new Page({ index: 1 });

    expect(page.index).toBe(1);
    expect(page.items).toEqual([]);
    expect(page.getItemCount()).toBe(0);
  });

  it('should create a page with initial items', () => {
    const textItem1 = new TextItem({
      x: 10,
      y: 20,
      width: 50,
      height: 15,
      text: 'Hello',
      pageNumber: 1
    });

    const textItem2 = new TextItem({
      x: 70,
      y: 20,
      width: 60,
      height: 15,
      text: 'World',
      pageNumber: 1
    });

    const page = new Page({ 
      index: 2, 
      items: [textItem1, textItem2] 
    });

    expect(page.index).toBe(2);
    expect(page.items).toEqual([textItem1, textItem2]);
    expect(page.getItemCount()).toBe(2);
  });

  it('should add items to the page', () => {
    const page = new Page({ index: 3 });

    const lineItem = new LineItem({
      x: 10,
      y: 20,
      width: 100,
      height: 15,
      words: [
        new Word({ string: 'Hello', type: WordType.NORMAL }),
        new Word({ string: 'World', type: WordType.NORMAL })
      ]
    });

    page.addItem(lineItem);

    expect(page.getItemCount()).toBe(1);
    expect(page.items[0]).toBe(lineItem);
  });

  it('should clear all items from the page', () => {
    const page = new Page({ index: 4 });

    const textItem1 = new TextItem({
      x: 10,
      y: 20,
      width: 50,
      height: 15,
      text: 'Hello'
    });

    const textItem2 = new TextItem({
      x: 70,
      y: 20,
      width: 60,
      height: 15,
      text: 'World'
    });

    page.addItem(textItem1);
    page.addItem(textItem2);

    expect(page.getItemCount()).toBe(2);

    page.clearItems();

    expect(page.getItemCount()).toBe(0);
    expect(page.items).toEqual([]);
  });

  it('should handle multiple types of page items', () => {
    const page = new Page({ index: 5 });

    const textItem = new TextItem({
      x: 10,
      y: 20,
      width: 50,
      height: 15,
      text: 'Hello'
    });

    const lineItem = new LineItem({
      x: 70,
      y: 20,
      width: 100,
      height: 15,
      words: [new Word({ string: 'World', type: WordType.NORMAL })]
    });

    page.addItem(textItem);
    page.addItem(lineItem);

    expect(page.getItemCount()).toBe(2);
    expect(page.items[0]).toBe(textItem);
    expect(page.items[1]).toBe(lineItem);
  });
}); 