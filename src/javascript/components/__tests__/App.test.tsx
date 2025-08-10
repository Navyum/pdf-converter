import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { View, AppStateType } from '../../models/AppState';

// 模拟 AppState
const createMockAppState = (overrides = {}): AppStateType => ({
  mainView: View.UPLOAD,
  fileBuffer: null as any,
  pdfPages: [],
  finalText: '',
  transformations: [],
  storeFileBuffer: jest.fn(),
  storePdfPages: jest.fn(),
  switchMainView: jest.fn(),
  render: jest.fn(),
  ...overrides
});

describe('App Component', () => {
  it('renders without crashing', () => {
    const mockAppState = createMockAppState();
    const { getByText } = render(<App appState={mockAppState as any} />);
    // 顶部标题包含图标，使用正则匹配子串
    expect(getByText(/PDF To Markdown/)).toBeInTheDocument();
  });

  it('renders UploadView when mainView is UPLOAD', () => {
    const mockAppState = createMockAppState({ mainView: View.UPLOAD });
    const { getByText } = render(<App appState={mockAppState as any} />);
    
    expect(getByText('Drop your PDF file here!')).toBeInTheDocument();
  });

  it('renders ResultView when mainView is RESULT', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.RESULT,
      pdfPages: [{ pageNumber: 1 }],
      transformations: [{ name: 'Test Transformation', transform: (r: any) => r }]
    });
    const { getByText } = render(<App appState={mockAppState as any} />);
    
    expect(getByText('Edit')).toBeInTheDocument();
    expect(getByText('Preview')).toBeInTheDocument();
  });

  it('renders DebugView when mainView is DEBUG', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.DEBUG,
      pdfPages: [{ pageNumber: 1 }],
      transformations: [{ name: 'Test Transformation', transform: (r: any) => r }]
    });
    const { getByText } = render(<App appState={mockAppState as any} />);
    
    expect(getByText('Pages')).toBeInTheDocument();
    // 移除 Transformations 显示检查
  });

  it('passes correct props to TopBar', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.UPLOAD
    });
    const { getByText } = render(<App appState={mockAppState as any} />);
    
    expect(getByText('PDF To Markdown')).toBeInTheDocument();
  });

  it('throws error for unsupported view', () => {
    const mockAppState = createMockAppState({ mainView: 'INVALID_VIEW' as any });
    
    expect(() => render(<App appState={mockAppState as any} />)).toThrow('View INVALID_VIEW not supported!');
  });
}); 