// 定义 PDF 相关的通用类型
export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  text?: string;
  items?: string[];
}

export interface PDFDocument {
  pages: PDFPage[];
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  };
}

export interface TransformationResult {
  type: string;
  description: string;
  applied: boolean;
  transform: (parseResult: any) => any;
  completeTransform?: (parseResult: any) => any;
}

export type FileBuffer = ArrayBuffer | null;

export interface AppState {
  document?: PDFDocument;
  transformations: TransformationResult[];
  currentView: 'upload' | 'processing' | 'result';
} 