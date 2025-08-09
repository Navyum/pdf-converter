// 抽象流类，允许临时存储项目
export default abstract class StashingStream<T, R = T> {
  protected results: R[];
  protected stash: T[];

  constructor() {
    if (new.target === StashingStream) {
      throw new TypeError("Cannot construct StashingStream instances directly");
    }

    this.results = [];
    this.stash = [];
  }

  consumeAll(items: T[]): void {
    items.forEach(item => this.consume(item));
  }

  consume(item: T): void {
    if (this.shouldStash(item)) {
      if (!this.matchesStash(item)) {
        this.flushStash();
      }
      this.pushOnStash(item);
    } else {
      if (this.stash.length > 0) {
        this.flushStash();
      }
      this.results.push(this.convertItem(item));
    }
  }

  protected pushOnStash(item: T): void {
    this.onPushOnStash(item);
    this.stash.push(item);
  }

  complete(): R[] {
    if (this.stash.length > 0) {
      this.flushStash();
    }
    return this.results;
  }

  protected matchesStash(item: T): boolean {
    if (this.stash.length === 0) {
      return true;
    }
    const lastItem = this.stash[this.stash.length - 1];
    return this.doMatchesStash(lastItem, item);
  }

  protected flushStash(): void {
    if (this.stash.length > 0) {
      this.doFlushStash(this.stash, this.results);
      this.stash = [];
    }
  }

  protected onPushOnStash(item: T): void {
    // Sub-classes may override
  }

  protected abstract shouldStash(item: T): boolean;

  protected abstract doMatchesStash(lastItem: T, item: T): boolean;

  protected abstract doFlushStash(stash: T[], results: R[]): void;

  protected abstract convertItem(item: T): R;
} 