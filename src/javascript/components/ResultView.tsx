import React, { useState, useEffect, useCallback } from 'react';
import { Remarkable } from 'remarkable';

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
}

// 定义组件的 Props 类型
interface ResultViewProps {
  pages: PDFPage[];
  transformations: TransformationResult[];
  precomputedText?: string;
}

// 定义 ParseResult 接口
interface ParseResult {
  pages: {
    items: string[];
  }[];
}

const ResultView: React.FC<ResultViewProps> = ({ pages, transformations, precomputedText }) => {
  console.log('[ResultView] props.pages length:', pages?.length, 'transformations:', transformations?.length);
  const [text, setText] = useState(precomputedText || '');

  const safePages = Array.isArray(pages) ? pages : [];
  const safeTransformations = Array.isArray(transformations) ? transformations : [];

  useEffect(() => {
    if (precomputedText && precomputedText.length > 200) {
      // 已有较完整的预计算文本，直接使用
      setText(precomputedText);
      console.log('[ResultView] use precomputedText length:', precomputedText.length);
      return;
    }
    if (precomputedText && precomputedText.length > 0) {
      console.warn('[ResultView] precomputedText too short, fallback to local transform. length=', precomputedText.length);
    }

    console.log('[ResultView] useEffect start');
    try {
      const clonedPages = JSON.parse(JSON.stringify(safePages));
      let parseResult: any = { pages: clonedPages, globals: {}, messages: [] };
      console.log('[ResultView] initial parseResult pages:', parseResult.pages.length, 'first page items:', parseResult.pages[0]?.items?.length);
      
      // 详细记录每个页面的项目信息
      parseResult.pages.forEach((page: any, pageIndex: number) => {
        console.log(`[ResultView] 页面 ${pageIndex + 1} 详细信息:`, {
          itemsCount: page.items?.length || 0,
          items: page.items?.map((item: any, itemIndex: number) => ({
            index: itemIndex,
            constructor: item.constructor?.name,
            type: item.type,
            hasText: !!item.text,
            hasToMarkdown: !!item.toMarkdown,
            altText: item.altText
          })) || []
        });
      });

      let lastTransformation: any = null;
      safeTransformations.forEach((transformation, idx) => {
        console.log('[ResultView] applying transform', idx, transformation?.name || transformation?.type);
        
        // 记录转换前的状态
        console.log(`[ResultView] 转换 ${idx} 前状态:`, {
          pagesCount: parseResult.pages?.length,
          totalItems: parseResult.pages?.reduce((sum: number, page: any) => sum + (page.items?.length || 0), 0)
        });
        
        if (lastTransformation && typeof lastTransformation.completeTransform === 'function') {
          parseResult = lastTransformation.completeTransform(parseResult) || parseResult;
        }
        if (transformation && typeof transformation.transform === 'function') {
          parseResult = transformation.transform(parseResult) || parseResult;
        }
        
        // 记录转换后的状态
        console.log(`[ResultView] 转换 ${idx} 后状态:`, {
          pagesCount: parseResult.pages?.length,
          totalItems: parseResult.pages?.reduce((sum: number, page: any) => sum + (page.items?.length || 0), 0)
        });
        
        lastTransformation = transformation;
      });

      if (lastTransformation && typeof lastTransformation.completeTransform === 'function') {
        parseResult = lastTransformation.completeTransform(parseResult) || parseResult;
      }

      const allItems = (parseResult.pages || []).flatMap((page: any) => page.items || []);
      console.log('[ResultView] 最终项目统计:', {
        totalItems: allItems.length,
        textItems: allItems.filter((item: any) => item.constructor?.name === 'TextItem').length,
        itemsWithType: allItems.filter((item: any) => item.type).length,
        itemsWithToMarkdown: allItems.filter((item: any) => item.toMarkdown).length
      });
      
      // 详细记录每个项目的处理过程
      allItems.forEach((item: any, index: number) => {
        console.log(`[ResultView] 项目 ${index} 处理:`, {
          constructor: item.constructor?.name,
          type: item.type,
          hasToMarkdown: !!item.toMarkdown,
          hasText: !!item.text,
          altText: item.altText,
          willGenerate: item.toMarkdown ? item.toMarkdown() : item.text || '[Unknown Item]'
        });
      });
      
      const generatedText = allItems.map((item: any) => {
        // 如果是字符串，直接返回
        if (typeof item === 'string') {
          return item;
        }
        // 如果是对象且有toMarkdown方法，使用toMarkdown
        if (item && typeof item.toMarkdown === 'function') {
          return item.toMarkdown();
        }
        // 如果是对象且有text属性，使用text
        if (item && item.text) {
          return item.text;
        }
        // 其他情况，尝试转换为字符串
        return String(item);
      }).join('\n');
      console.log('[ResultView] generated text length:', generatedText.length);
      console.log('[ResultView] generated text preview:', generatedText.substring(0, 500));
      setText(generatedText);
    } catch (e) {
      console.error('[ResultView] error during transformation:', e);
      setText('');
    }
  }, [safePages, safeTransformations, precomputedText]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }, []);

  const remarkable = new Remarkable({
    breaks: true,
    html: true
  });

  return (
    <div className="result-view-container">
      <div className="result-view-layout">
        {/* 左侧预览区域 */}
        <div className="result-preview-panel">
          <div className="panel-header">
            <h3>预览</h3>
          </div>
          <div className="panel-content">
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: remarkable.render(text) }} 
            />
          </div>
        </div>

        {/* 右侧编辑区域 */}
        <div className="result-edit-panel">
          <div className="panel-header">
            <h3>编辑</h3>
          </div>
          <div className="panel-content">
            <textarea
              className="markdown-editor"
              value={text}
              onChange={handleChange}
              placeholder="在这里编辑 Markdown 内容..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView; 