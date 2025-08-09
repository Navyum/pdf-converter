// PDF 文档元数据接口
export interface OriginalMetadata {
  metadata?: Map<string, string>;
  info?: {
    Title?: string;
    Author?: string;
    Creator?: string;
    Producer?: string;
  };
}

// PDF 文档元数据类
export default class Metadata {
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;

  constructor(originalMetadata: OriginalMetadata) {
    if (originalMetadata.metadata) {
      // 使用 PDF.js 的 metadata Map
      this.title = originalMetadata.metadata.get('dc:title');
      this.creator = originalMetadata.metadata.get('xap:creatortool');
      this.producer = originalMetadata.metadata.get('pdf:producer');
    } else if (originalMetadata.info) {
      // 使用传统的 info 对象
      this.title = originalMetadata.info.Title;
      this.author = originalMetadata.info.Author;
      this.creator = originalMetadata.info.Creator;
      this.producer = originalMetadata.info.Producer;
    }
  }
} 