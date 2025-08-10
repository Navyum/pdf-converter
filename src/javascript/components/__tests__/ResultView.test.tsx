import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ResultView from '../ResultView';

// 模拟测试数据
const mockPages = [
  { 
    pageNumber: 1, 
    width: 100, 
    height: 200, 
    items: ['First page content'] 
  }
];

const mockTransformations = [
  {
    type: 'test',
    name: 'Test transformation',
    description: 'Test transformation',
    applied: true,
    transform: (parseResult: any) => parseResult,
  }
];

describe('ResultView Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <ResultView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    expect(getByText('预览')).toBeInTheDocument();
    expect(getByText('编辑')).toBeInTheDocument();
  });

  it('displays both preview and edit panels', () => {
    const { getByText, container } = render(
      <ResultView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    // 检查面板标题
    expect(getByText('预览')).toBeInTheDocument();
    expect(getByText('编辑')).toBeInTheDocument();

    // 检查是否渲染了 textarea
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
    
    // 检查是否渲染了预览区域
    const previewPanel = container.querySelector('.markdown-preview');
    expect(previewPanel).toBeInTheDocument();
  });

  it('updates preview when editing text', () => {
    const { container } = render(
      <ResultView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    
    // 修改文本
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    
    // 检查预览是否更新
    const previewPanel = container.querySelector('.markdown-preview');
    expect(previewPanel).toHaveTextContent('Updated content');
  });
}); 