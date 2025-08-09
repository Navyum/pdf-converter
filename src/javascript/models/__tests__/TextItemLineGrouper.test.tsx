import TextItemLineGrouper from '../TextItemLineGrouper';
import TextItem from '../TextItem';

describe('TextItemLineGrouper', () => {
  let grouper: TextItemLineGrouper;

  beforeEach(() => {
    grouper = new TextItemLineGrouper();
  });

  it('should group items on the same line', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 100,
        width: 50,
        height: 15,
        text: 'Hello'
      }),
      new TextItem({
        x: 70,
        y: 100,
        width: 60,
        height: 15,
        text: 'World'
      })
    ];

    const groupedLines = grouper.group(textItems);

    expect(groupedLines.length).toBe(1);
    expect(groupedLines[0].length).toBe(2);
    expect(groupedLines[0][0].text).toBe('Hello');
    expect(groupedLines[0][1].text).toBe('World');
  });

  it('should separate items on different lines', () => {
    const textItems = [
      new TextItem({
        x: 10,
        y: 100,
        width: 50,
        height: 15,
        text: 'Hello'
      }),
      new TextItem({
        x: 70,
        y: 120,
        width: 60,
        height: 15,
        text: 'World'
      })
    ];

    const groupedLines = grouper.group(textItems);

    expect(groupedLines.length).toBe(2);
    expect(groupedLines[0].length).toBe(1);
    expect(groupedLines[1].length).toBe(1);
    expect(groupedLines[0][0].text).toBe('Hello');
    expect(groupedLines[1][0].text).toBe('World');
  });

  it('should handle custom line distance threshold', () => {
    const grouper = new TextItemLineGrouper({ mostUsedDistance: 20 });

    const textItems = [
      new TextItem({
        x: 10,
        y: 100,
        width: 50,
        height: 15,
        text: 'Hello'
      }),
      new TextItem({
        x: 70,
        y: 115,
        width: 60,
        height: 15,
        text: 'World'
      }),
      new TextItem({
        x: 20,
        y: 140,
        width: 40,
        height: 15,
        text: 'Test'
      })
    ];

    const groupedLines = grouper.group(textItems);

    expect(groupedLines.length).toBe(2);
    expect(groupedLines[0].length).toBe(2);
    expect(groupedLines[1].length).toBe(1);
    expect(groupedLines[0][0].text).toBe('Hello');
    expect(groupedLines[0][1].text).toBe('World');
    expect(groupedLines[1][0].text).toBe('Test');
  });

  it('should sort items within a line by x coordinate', () => {
    const textItems = [
      new TextItem({
        x: 70,
        y: 100,
        width: 60,
        height: 15,
        text: 'World'
      }),
      new TextItem({
        x: 10,
        y: 100,
        width: 50,
        height: 15,
        text: 'Hello'
      })
    ];

    const groupedLines = grouper.group(textItems);

    expect(groupedLines.length).toBe(1);
    expect(groupedLines[0].length).toBe(2);
    expect(groupedLines[0][0].text).toBe('Hello');
    expect(groupedLines[0][1].text).toBe('World');
  });

  it('should handle empty input', () => {
    const groupedLines = grouper.group([]);

    expect(groupedLines.length).toBe(0);
  });

  it('should handle single item input', () => {
    const textItem = new TextItem({
      x: 10,
      y: 100,
      width: 50,
      height: 15,
      text: 'Hello'
    });

    const groupedLines = grouper.group([textItem]);

    expect(groupedLines.length).toBe(1);
    expect(groupedLines[0].length).toBe(1);
    expect(groupedLines[0][0]).toBe(textItem);
  });
}); 