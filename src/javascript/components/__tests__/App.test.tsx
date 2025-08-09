import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { View, AppStateType } from '../../models/AppState';

// 模拟 AppState
const createMockAppState = (overrides = {}): AppStateType & {
  fileBuffer?: Uint8Array;
  pages?: any[];
  transformations?: any[];
  metadata?: { title?: string };
} => ({
  mainView: View.UPLOAD,
  fileBuffer: undefined,
  pages: [],
  transformations: [],
  metadata: {},
  storeFileBuffer: jest.fn(),
  storePdfPages: jest.fn(),
  switchMainView: jest.fn(),
  render: jest.fn(),
  ...overrides
});

describe('App Component', () => {
  it('renders without crashing', () => {
    const mockAppState = createMockAppState();
    const { getByText } = render(<App appState={mockAppState} />);
    
    expect(getByText('PDF To Markdown Converter')).toBeInTheDocument();
  });

  it('renders UploadView when mainView is UPLOAD', () => {
    const mockAppState = createMockAppState({ mainView: View.UPLOAD });
    const { getByText } = render(<App appState={mockAppState} />);
    
    expect(getByText('Drop your PDF file here!')).toBeInTheDocument();
  });

  it('renders ResultView when mainView is RESULT', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.RESULT,
      pages: [{ pageNumber: 1 }],
      transformations: [{ name: 'Test Transformation' }]
    });
    const { getByText } = render(<App appState={mockAppState} />);
    
    expect(getByText('Edit')).toBeInTheDocument();
    expect(getByText('Preview')).toBeInTheDocument();
  });

  it('renders DebugView when mainView is DEBUG', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.DEBUG,
      pages: [{ pageNumber: 1 }],
      transformations: [{ name: 'Test Transformation' }]
    });
    const { getByText } = render(<App appState={mockAppState} />);
    
    expect(getByText('Pages')).toBeInTheDocument();
    expect(getByText('Transformations')).toBeInTheDocument();
  });

  it('passes correct props to TopBar', () => {
    const mockAppState = createMockAppState({ 
      mainView: View.UPLOAD,
      metadata: { title: 'Test Document' }
    });
    const { getByText } = render(<App appState={mockAppState} />);
    
    expect(getByText('Test Document')).toBeInTheDocument();
  });

  it('throws error for unsupported view', () => {
    const mockAppState = createMockAppState({ mainView: 'INVALID_VIEW' as any });
    
    expect(() => render(<App appState={mockAppState} />)).toThrow('View INVALID_VIEW not supported');
  });
}); 