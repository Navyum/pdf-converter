import StashingStream from '../StashingStream';

// 用于测试的具体实现
class TestStashingStream extends StashingStream<number, string> {
  private stashThreshold: number;

  constructor(stashThreshold: number) {
    super();
    this.stashThreshold = stashThreshold;
  }

  protected shouldStash(item: number): boolean {
    return item < this.stashThreshold;
  }

  protected doMatchesStash(lastItem: number, item: number): boolean {
    return item < this.stashThreshold;
  }

  protected doFlushStash(stash: number[], results: string[]): void {
    const combinedStash = stash.reduce((sum, item) => sum + item, 0);
    results.push(combinedStash.toString());
  }

  protected convertItem(item: number): string {
    return item.toString();
  }

  protected onPushOnStash(_item: number): void {
    // 可选的钩子方法实现
  }
}

describe('StashingStream', () => {
  let stream: TestStashingStream;

  beforeEach(() => {
    stream = new TestStashingStream(5);
  });

  it('should prevent direct instantiation of abstract class', () => {
    expect(() => {
      // @ts-expect-error Testing abstract class instantiation
      new StashingStream();
    }).toThrow(TypeError);
  });

  it('should consume single items', () => {
    stream.consume(3);
    stream.consume(6);

    const result = stream.complete();
    expect(result).toEqual(['3', '6']);
  });

  it('should stash and flush items below threshold', () => {
    stream.consume(1);
    stream.consume(2);
    stream.consume(6);

    const result = stream.complete();
    expect(result).toEqual(['3', '6']);
  });

  it('should handle multiple stash and flush cycles', () => {
    stream.consume(1);
    stream.consume(2);
    stream.consume(6);
    stream.consume(3);
    stream.consume(7);

    const result = stream.complete();
    expect(result).toEqual(['3', '6', '3', '7']);
  });

  it('should consume all items in a batch', () => {
    stream.consumeAll([1, 2, 6, 3, 7]);

    const result = stream.complete();
    expect(result).toEqual(['3', '6', '3', '7']);
  });

  it('should handle empty input', () => {
    stream.consumeAll([]);

    const result = stream.complete();
    expect(result).toEqual([]);
  });

  it('should handle single item input', () => {
    stream.consume(4);

    const result = stream.complete();
    expect(result).toEqual(['4']);
  });

  it('should handle all items below threshold', () => {
    stream.consumeAll([1, 2, 3, 4]);

    const result = stream.complete();
    expect(result).toEqual(['10']);
  });

  it('should handle all items above threshold', () => {
    stream.consumeAll([6, 7, 8, 9]);

    const result = stream.complete();
    expect(result).toEqual(['6', '7', '8', '9']);
  });
}); 