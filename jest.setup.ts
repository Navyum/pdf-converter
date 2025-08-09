// 引入必要的测试工具
import '@testing-library/jest-dom';

// 全局设置
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟 PDF.js 相关功能
jest.mock('pdfjs-dist/build/pdf', () => ({
  GlobalWorkerOptions: {
    workerSrc: 'path/to/pdf.worker.js',
  },
  getDocument: jest.fn(),
}));

// 清理 mock
afterEach(() => {
  jest.clearAllMocks();
}); 