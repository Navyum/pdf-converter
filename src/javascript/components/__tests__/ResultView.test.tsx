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
    
    expect(getByText('Edit')).toBeInTheDocument();
    expect(getByText('Preview')).toBeInTheDocument();
  });

  it('switches between edit and preview modes', () => {
    const { getByText, container } = render(
      <ResultView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    // 默认为预览模式
    const previewButton = getByText('Preview');
    const editButton = getByText('Edit');
    
    expect(previewButton).toHaveClass('active');
    expect(editButton).not.toHaveClass('active');

    // 切换到编辑模式
    fireEvent.click(editButton);
    
    expect(editButton).toHaveClass('active');
    expect(previewButton).not.toHaveClass('active');
    
    // 检查是否渲染了 textarea
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
  });
}); 