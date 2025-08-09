import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DebugView from '../DebugView';

// 定义内联类型
interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  text?: string;
  items?: string[];
}

interface TransformationResult {
  type: string;
  name: string;
  description: string;
  applied: boolean;
  itemType?: string;
  transform: (parseResult: any) => any;
  completeTransform?: (parseResult: any) => any;
  createPageView?: (page: any, modificationsOnly: boolean) => React.ReactElement;
  showModificationCheckbox?: () => boolean;
}

// 模拟测试数据
const mockPages: PDFPage[] = [
  { 
    pageNumber: 1, 
    width: 100, 
    height: 200, 
    text: 'Test Page 1' 
  },
  { 
    pageNumber: 2, 
    width: 100, 
    height: 200, 
    text: 'Test Page 2' 
  }
];

const mockTransformations: TransformationResult[] = [
  {
    type: 'test',
    name: 'Test Transformation 1',
    description: 'First test transformation',
    applied: true,
    itemType: 'text',
    transform: (parseResult: any) => parseResult,
    createPageView: (page: any, modificationsOnly: boolean) => (
      <div key={page.pageNumber}>{page.text}</div>
    ),
    showModificationCheckbox: () => true
  },
  {
    type: 'test',
    name: 'Test Transformation 2',
    description: 'Second test transformation',
    applied: true,
    itemType: 'text',
    transform: (parseResult: any) => parseResult,
    createPageView: (page: any, modificationsOnly: boolean) => (
      <div key={page.pageNumber}>{page.text}</div>
    )
  }
];

describe('DebugView Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <DebugView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    expect(getByText('Pages')).toBeInTheDocument();
    expect(getByText('Transformations - 0 / 1')).toBeInTheDocument();
  });

  it('allows navigation between transformations', () => {
    const { getByText, queryByText } = render(
      <DebugView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    const nextButton = getByText('Next →');
    const prevButton = getByText('← Previous');

    // 初始状态
    expect(queryByText('Test Transformation 1')).toBeInTheDocument();
    expect(prevButton).toHaveClass('btn-round disabled');

    // 点击下一步
    fireEvent.click(nextButton);
    expect(queryByText('Test Transformation 2')).toBeInTheDocument();

    // 再次点击下一步，按钮应该禁用
    fireEvent.click(nextButton);
    expect(nextButton).toHaveClass('btn-round disabled');
  });

  it('allows page selection', () => {
    const { getByText, getAllByText } = render(
      <DebugView 
        pages={mockPages} 
        transformations={mockTransformations} 
      />
    );
    
    // 初始状态显示所有页面
    expect(getAllByText(/Test Page/)).toHaveLength(2);

    // 选择第二页
    const secondPageButton = getByText('2');
    fireEvent.click(secondPageButton);

    // 只显示第二页
    expect(getAllByText(/Test Page/)).toHaveLength(1);
    expect(getByText('Test Page 2')).toBeInTheDocument();
  });

  it('toggles statistics view', () => {
    const mockTransformationsWithStats: TransformationResult[] = [
      {
        ...mockTransformations[0],
        transform: () => ({
          pages: mockPages,
          globals: { 
            'Total Pages': mockPages.length,
            'Total Words': 10 
          },
          messages: []
        })
      }
    ];

    const { getByText } = render(
      <DebugView 
        pages={mockPages} 
        transformations={mockTransformationsWithStats} 
      />
    );
    
    const showStatisticsCheckbox = getByText('Show Statistics');
    fireEvent.click(showStatisticsCheckbox);

    expect(getByText('Total Pages: 2')).toBeInTheDocument();
  });
}); 