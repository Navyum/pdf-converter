import TextItem, { TextItemOptions } from '../TextItem';
import PageItem from '../PageItem';

describe('TextItem', () => {
  const defaultOptions: TextItemOptions = {
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    text: 'Test Text'
  };

  it('creates a TextItem with basic properties', () => {
    const textItem = new TextItem(defaultOptions);

    expect(textItem).toBeInstanceOf(TextItem);
    expect(textItem).toBeInstanceOf(PageItem);
    expect(textItem.x).toBe(10);
    expect(textItem.y).toBe(20);
    expect(textItem.width).toBe(100);
    expect(textItem.height).toBe(50);
    expect(textItem.text).toBe('Test Text');
  });

  it('supports optional properties', () => {
    const fullOptions: TextItemOptions = {
      ...defaultOptions,
      font: 'Arial',
      lineFormat: 'bold',
      unopenedFormat: 'italic',
      unclosedFormat: 'underline'
    };

    const textItem = new TextItem(fullOptions);

    expect(textItem.font).toBe('Arial');
    expect(textItem.lineFormat).toBe('bold');
    expect(textItem.unopenedFormat).toBe('italic');
    expect(textItem.unclosedFormat).toBe('underline');
  });

  it('passes options to parent PageItem', () => {
    const mockPageItemOptions = {
      ...defaultOptions,
      pageNumber: 1
    };

    const textItem = new TextItem(mockPageItemOptions);

    // 假设 PageItem 有一个 pageNumber 属性
    expect((textItem as any).pageNumber).toBe(1);
  });
}); 