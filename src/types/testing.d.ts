import '@testing-library/jest-dom';
import '@testing-library/react';

// 扩展 Jest 匹配器
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

// 全局测试工具声明
declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const beforeEach: jest.Lifecycle;
  const expect: jest.Expect;
  const afterEach: jest.Lifecycle;
} 