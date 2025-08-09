import Metadata from '../Metadata';

describe('Metadata', () => {
  it('should extract metadata from Map', () => {
    const metadataMap = new Map<string, string>([
      ['dc:title', 'Test Document'],
      ['xap:creatortool', 'Test Creator'],
      ['pdf:producer', 'Test Producer']
    ]);

    const metadata = new Metadata({ metadata: metadataMap });

    expect(metadata.title).toBe('Test Document');
    expect(metadata.creator).toBe('Test Creator');
    expect(metadata.producer).toBe('Test Producer');
    expect(metadata.author).toBeUndefined();
  });

  it('should extract metadata from info object', () => {
    const metadataInfo = {
      Title: 'Test Document',
      Author: 'Test Author',
      Creator: 'Test Creator',
      Producer: 'Test Producer'
    };

    const metadata = new Metadata({ info: metadataInfo });

    expect(metadata.title).toBe('Test Document');
    expect(metadata.author).toBe('Test Author');
    expect(metadata.creator).toBe('Test Creator');
    expect(metadata.producer).toBe('Test Producer');
  });

  it('should handle empty metadata', () => {
    const metadata1 = new Metadata({});
    expect(metadata1.title).toBeUndefined();
    expect(metadata1.author).toBeUndefined();
    expect(metadata1.creator).toBeUndefined();
    expect(metadata1.producer).toBeUndefined();

    const metadata2 = new Metadata({ metadata: new Map() });
    expect(metadata2.title).toBeUndefined();
    expect(metadata2.author).toBeUndefined();
    expect(metadata2.creator).toBeUndefined();
    expect(metadata2.producer).toBeUndefined();
  });

  it('should prioritize metadata Map over info object', () => {
    const metadataMap = new Map<string, string>([
      ['dc:title', 'Map Title'],
      ['xap:creatortool', 'Map Creator']
    ]);

    const metadataInfo = {
      Title: 'Info Title',
      Author: 'Info Author',
      Creator: 'Info Creator',
      Producer: 'Info Producer'
    };

    const metadata = new Metadata({ 
      metadata: metadataMap, 
      info: metadataInfo 
    });

    expect(metadata.title).toBe('Map Title');
    expect(metadata.creator).toBe('Map Creator');
    expect(metadata.producer).toBeUndefined();
    expect(metadata.author).toBeUndefined();
  });
}); 