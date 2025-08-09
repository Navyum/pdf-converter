import '@testing-library/jest-dom';

// 扩展 Jest 匹配器
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

// 最小化声明，避免 TS 找不到模块类型报错
declare module '@testing-library/react' {
  export * from '@testing-library/dom';
  export const render: any;
  export const fireEvent: any;
}

// 全局测试工具声明
declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const beforeEach: jest.Lifecycle;
  const expect: jest.Expect;
  const afterEach: jest.Lifecycle;
} 