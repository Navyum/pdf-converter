import ParseResult from '../ParseResult';

describe('ParseResult', () => {
  it('should create an empty ParseResult', () => {
    const parseResult = new ParseResult({ pages: [] });

    expect(parseResult.pages).toEqual([]);
    expect(parseResult.globals).toEqual({});
    expect(parseResult.messages).toEqual([]);
  });

  it('should create a ParseResult with initial data', () => {
    const pages = [{ content: 'Page 1' }, { content: 'Page 2' }];
    const globals = { key1: 'value1', key2: 42 };
    const messages = ['Message 1', 'Message 2'];

    const parseResult = new ParseResult({ pages, globals, messages });

    expect(parseResult.pages).toEqual(pages);
    expect(parseResult.globals).toEqual(globals);
    expect(parseResult.messages).toEqual(messages);
  });

  it('should add a message', () => {
    const parseResult = new ParseResult({ pages: [] });

    parseResult.addMessage('Test message');
    expect(parseResult.messages).toEqual(['Test message']);

    parseResult.addMessage('Another message');
    expect(parseResult.messages).toEqual(['Test message', 'Another message']);
  });

  it('should add a global', () => {
    const parseResult = new ParseResult({ pages: [] });

    parseResult.addGlobal('key1', 'value1');
    expect(parseResult.globals).toEqual({ key1: 'value1' });

    parseResult.addGlobal('key2', 42);
    expect(parseResult.globals).toEqual({ 
      key1: 'value1', 
      key2: 42 
    });

    parseResult.addGlobal('key1', 'new value');
    expect(parseResult.globals).toEqual({ 
      key1: 'new value', 
      key2: 42 
    });
  });

  it('should handle different types of global values', () => {
    const parseResult = new ParseResult({ pages: [] });

    parseResult.addGlobal('string', 'test');
    parseResult.addGlobal('number', 42);
    parseResult.addGlobal('boolean', true);
    parseResult.addGlobal('object', { nested: 'value' });
    parseResult.addGlobal('array', [1, 2, 3]);

    expect(parseResult.globals).toEqual({
      string: 'test',
      number: 42,
      boolean: true,
      object: { nested: 'value' },
      array: [1, 2, 3]
    });
  });
}); 